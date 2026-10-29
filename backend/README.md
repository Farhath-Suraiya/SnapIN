# Face Recognition Attendance System - FastAPI Backend

A simple FastAPI backend that accepts image uploads, processes them for face recognition, and returns attendance results.

## Folder Structure
```
d:/Snapin_final/
├── main.py              # FastAPI application and routes
├── recognition.py       # Face recognition logic (placeholder)
├── requirements.txt     # Python dependencies
├── test_api.py          # Script to test the API endpoint
└── temp_uploads/        # (Auto-created) Temporary image storage
```

## Setup and Installation

1.  **Install Dependencies**:
    Make sure you have Python installed, then run:
    ```bash
    pip install -r requirements.txt
    ```

2.  **Add Your Logic**:
    Update the `mark_attendance(image_path)` function in `recognition.py` with your actual face recognition code.

## How to Run

1.  **Start the Server**:
    From the root directory, run:
    ```bash
    uvicorn main:app --reload
    ```
    The server will be available at `http://127.0.0.1:8000`.

2.  **Test the Endpoint**:
    You can use the provided `test_api.py` script:
    ```bash
    python test_api.py
    ```
    Alternatively, use `curl`:
    ```bash
    curl -X POST "http://127.0.0.1:8000/detect-attendance" -F "file=@path_to_your_image.jpg"
    ```

## API Endpoint Detail

### POST `/detect-attendance`
- **Request**: Multipart form-data with a `file` field containing an image.
- **Response**: JSON result from `mark_attendance`.
  ```json
  {
    "present": ["..."],
    "absent": ["..."]
  }
  ```
