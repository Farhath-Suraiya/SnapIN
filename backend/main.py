from fastapi import FastAPI, File, UploadFile, HTTPException, Form, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import shutil
import os
import uuid
import subprocess
import sys
import json
import datetime
from typing import List
import bcrypt

# Password Hashing Helpers (using bcrypt directly to avoid passlib incompatibilities)
def hash_password(password: str) -> str:
    pwd_bytes = password.encode("utf-8")[:72]
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(pwd_bytes, salt).decode("utf-8")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        pwd_bytes = plain_password.encode("utf-8")[:72]
        return bcrypt.checkpw(pwd_bytes, hashed_password.encode("utf-8"))
    except Exception:
        return False

# Import database components
from database import SessionLocal, User, Student, Attendance, init_db

# Initialize database
init_db()

app = FastAPI(title="SnapIN Smart Attendance API")

# ---------------- DB SESSION ----------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ---------------- CORS ----------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_origin_regex=r"^https?://(localhost|127\.0\.0\.1)(:\d+)?$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- PATHS ----------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.abspath(os.path.join(BASE_DIR, "..", "model"))
DATASET_DIR = os.path.join(MODEL_DIR, "dataset")
ENCODE_SCRIPT = os.path.join(MODEL_DIR, "encode_faces.py")
RECOGNIZE_SCRIPT = os.path.join(MODEL_DIR, "recognize_and_mark.py")

os.makedirs(DATASET_DIR, exist_ok=True)

# ---------------- SYNC LOGIC (SINGLE SOURCE OF TRUTH) ----------------

def sync_dataset_with_db(db: Session):
    """
    Synchronizes the database roster with the physical model/dataset folder.
    The folder structure is the Master Source.
    """
    if not os.path.exists(DATASET_DIR):
        print("SYNC: Dataset folder not found")
        return

    # 1. Read all folders from dataset
    folders = [f for f in os.listdir(DATASET_DIR) if os.path.isdir(os.path.join(DATASET_DIR, f))]
    print("SYNC: Dataset folders detected:", folders)

    # 2. Extract Name and Roll Number
    dataset_students = []
    for f in folders:
        if "_" in f:
            try:
                name, roll = f.rsplit("_", 1)
                dataset_students.append({"name": name, "roll_number": roll})
            except Exception:
                continue
    
    # 3. Read current DB state
    db_students_all = db.query(Student).all()
    db_map = {f"{s.name}_{s.roll_number}": s for s in db_students_all}
    print("SYNC: DB students currently indexed:", list(db_map.keys()))

    # 4. Insert missing students
    inserted = 0
    dataset_ids = set()
    for ds in dataset_students:
        identifier = f"{ds['name']}_{ds['roll_number']}"
        dataset_ids.add(identifier)
        if identifier not in db_map:
            db.add(Student(name=ds["name"], roll_number=ds["roll_number"]))
            inserted += 1

    # 5. Delete students no longer in dataset
    deleted = 0
    for identifier, student_obj in db_map.items():
        if identifier not in dataset_ids:
            db.delete(student_obj)
            deleted += 1

    db.commit()
    if inserted > 0 or deleted > 0:
        print(f"SYNC RESULT: Inserted: {inserted}, Deleted: {deleted}")

# Run sync on startup
@app.on_event("startup")
async def startup_sync():
    db = SessionLocal()
    try:
        sync_dataset_with_db(db)
    finally:
        db.close()

# ---------------- ROOT ----------------
@app.get("/")
async def root():
    return {"message": "SnapIN Backend Operational"}

# ---------------- AUTH ----------------
@app.post("/signup")
async def signup(data: dict, db: Session = Depends(get_db)):
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not name or not email or not password:
        raise HTTPException(status_code=400, detail="All fields required")

    if db.query(User).filter(User.email == email).first():
        raise HTTPException(status_code=400, detail="Email already exists")

    hashed_pwd = hash_password(password)
    user = User(name=name, email=email, hashed_password=hashed_pwd)

    db.add(user)
    db.commit()
    return {"message": "Signup successful"}

@app.post("/login")
async def login(data: dict, db: Session = Depends(get_db)):
    email = data.get("email")
    password = data.get("password")

    user = db.query(User).filter(User.email == email).first()
    if not user or not verify_password(password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return {
        "user": {"name": user.name, "email": user.email},
        "token": str(uuid.uuid4())
    }

# ---------------- STUDENT MANAGEMENT ----------------
@app.post("/add-student")
async def add_student(
    name: str = Form(...),
    roll_number: str = Form(...),
    images: List[UploadFile] = File(...),
    db: Session = Depends(get_db)
):
    """
    Saves images to dataset and triggers sync + encoding.
    """
    # 1. Save to dataset folder (Master Source)
    folder_name = f"{name}_{roll_number}"
    student_dir = os.path.join(DATASET_DIR, folder_name)
    os.makedirs(student_dir, exist_ok=True)

    for i, image in enumerate(images):
        path = os.path.join(student_dir, f"{i}.jpg")
        with open(path, "wb") as f:
            shutil.copyfileobj(image.file, f)

    # 2. Sync dataset with DB
    sync_dataset_with_db(db)

    # 3. Update encodings
    subprocess.run([sys.executable, ENCODE_SCRIPT])

    return {"message": "Student added and synced"}

@app.get("/students")
async def get_students(db: Session = Depends(get_db)):
    sync_dataset_with_db(db) # Trigger sync before fetching
    students = db.query(Student).all()
    return {"students": [{"name": s.name, "roll_number": s.roll_number} for s in students]}

# ---------------- ATTENDANCE ----------------
@app.post("/detect-attendance")
async def detect_attendance(file: UploadFile = File(...), db: Session = Depends(get_db)):
    # 1. Sync first to ensure we know all students
    sync_dataset_with_db(db)

    temp_path = os.path.join(BASE_DIR, "temp.jpg")
    try:
        with open(temp_path, "wb") as f:
            shutil.copyfileobj(file.file, f)

        # 2. Run recognition
        result = subprocess.run(
            [sys.executable, RECOGNIZE_SCRIPT, temp_path],
            capture_output=True, text=True
        )

        try:
            recognized = json.loads(result.stdout.strip().split("\n")[-1])
        except Exception:
            recognized = []

        # 3. Fresh Session Logic: Clear today's records
        today = datetime.datetime.now().strftime("%Y-%m-%d")
        db.query(Attendance).filter(Attendance.date == today).delete()
        db.commit()
        print(f"ATTENDANCE: Cleared records for {today} to refresh session.")

        # 4. Process and Store
        all_students = db.query(Student).all()
        present_list = []
        absent_list = []
        recognized_set = set(recognized)

        for s in all_students:
            identifier = f"{s.name}_{s.roll_number}"
            status = "Present" if identifier in recognized_set else "Absent"
            
            db.add(Attendance(student_name=s.name, status=status, date=today))
            
            if status == "Present":
                present_list.append(s.name)
            else:
                absent_list.append(s.name)

        db.commit()
        print("ATTENDANCE: Total students processed:", len(all_students))
        print("ATTENDANCE: Present:", present_list)
        print("ATTENDANCE: Absent:", absent_list)

        return {"present": present_list, "absent": absent_list}

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

@app.get("/attendance")
async def get_attendance(date: str, db: Session = Depends(get_db)):
    records = db.query(Attendance).filter(Attendance.date == date).all()
    results = []
    for r in records:
        student = db.query(Student).filter(Student.name == r.student_name).first()
        results.append({
            "name": r.student_name,
            "roll_number": student.roll_number if student else "N/A",
            "status": r.status,
            "date": r.date
        })
    return results

@app.get("/analytics")
async def get_analytics(db: Session = Depends(get_db)):
    today = datetime.datetime.now().strftime("%Y-%m-%d")
    total = db.query(Student).count()
    present = db.query(Attendance).filter(Attendance.date == today, Attendance.status == "Present").count()
    absent = db.query(Attendance).filter(Attendance.date == today, Attendance.status == "Absent").count()

    return {
        "total_students": total,
        "present_today": present,
        "absent_today": absent
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)