import face_recognition
import pickle
import os
import sys
import json

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ENCODINGS_FILE = os.path.join(BASE_DIR, "encodings.pkl")

if len(sys.argv) < 2:
    print(json.dumps([]))
    sys.exit(1)

image_path = sys.argv[1]

if not os.path.exists(ENCODINGS_FILE):
    print(json.dumps([]))
    sys.exit(1)

with open(ENCODINGS_FILE, "rb") as f:
    known_encodings, known_names = pickle.load(f)

try:
    image = face_recognition.load_image_file(image_path)
    locations = face_recognition.face_locations(image)
    encodings = face_recognition.face_encodings(image, locations)
except:
    print(json.dumps([]))
    sys.exit(1)

present = []

for face_encoding in encodings:
    matches = face_recognition.compare_faces(known_encodings, face_encoding)

    if True in matches:
        matched_idxs = [i for i, m in enumerate(matches) if m]

        counts = {}
        for i in matched_idxs:
            name = known_names[i]
            counts[name] = counts.get(name, 0) + 1

        best_match = max(counts, key=counts.get)
        present.append(best_match)

# Remove duplicates
present = list(set(present))

print(json.dumps(present))