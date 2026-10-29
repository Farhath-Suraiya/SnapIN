import face_recognition
import os
import pickle

# Get current script directory
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_DIR = os.path.join(BASE_DIR, "dataset")
ENCODINGS_FILE = os.path.join(BASE_DIR, "encodings.pkl")

known_encodings = []
known_names = []

print("INFO: Encoding student faces...")

if not os.path.exists(DATASET_DIR):
    print("ERROR: Dataset directory does not exist.")
    exit(1)

for student_name in os.listdir(DATASET_DIR):
    student_path = os.path.join(DATASET_DIR, student_name)

    if not os.path.isdir(student_path):
        continue

    print(f"INFO: Encoding student: {student_name}")
    for img_name in os.listdir(student_path):
        img_path = os.path.join(student_path, img_name)

        try:
            image = face_recognition.load_image_file(img_path)
            encodings = face_recognition.face_encodings(image)

            if len(encodings) > 0:
                known_encodings.append(encodings[0])
                known_names.append(student_name)
        except Exception as e:
            print(f"WARN: Could not process {img_path}: {e}")

print("INFO: Saving encodings...")

with open(ENCODINGS_FILE, "wb") as f:
    pickle.dump((known_encodings, known_names), f)

print("INFO: Model updated successfully.")
