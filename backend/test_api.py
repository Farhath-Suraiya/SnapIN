import requests
import os

def test_attendance_endpoint():
    url = "http://127.0.0.1:8000/detect-attendance"
    # Use the generated image for testing
    image_path = r"C:\Users\surai\.gemini\antigravity\brain\6287ca3c-e7fa-4554-bad3-a2e3896da1d2\test_face_1776261562114.png"
    
    if not os.path.exists(image_path):
        print(f"Error: Test image not found at {image_path}")
        return

    print(f"Testing endpoint {url} with image {image_path}...")
    
    try:
        with open(image_path, "rb") as f:
            files = {"file": (os.path.basename(image_path), f, "image/png")}
            response = requests.post(url, files=files)
            
        if response.status_code == 200:
            print("Success!")
            print("Response:", response.json())
        else:
            print(f"Failed with status code {response.status_code}")
            print("Response:", response.text)
            
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    test_attendance_endpoint()
