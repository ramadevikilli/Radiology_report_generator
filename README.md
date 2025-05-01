This project is an end-to-end system for automatically generating diagnostic reports from medical images (e.g., X-rays, CT scans). 
It uses deep learning for classification and a Flask-based backend, integrated with a frontend interface for uploading images and downloading PDF reports.

 Key Features:
 
Scan Type Detection (e.g., X-ray, CT)

Body Part Classification

Disease Prediction using trained deep learning models

Radiology Report Generation in structured format

PDF Download of generated diagnostic report

REST APIs with Flask

Frontend for user interaction

Tech Stack:


Frontend	:HTML, CSS, TypeScript (under src/),
Backend :	Python, Flask (app1.py, app2.py),
Models	 : PyTorch (saved model files),
Assets	 : Images stored under public/,
PDF Tool	:jsPDF (frontend) .


Project Structure:


Radiology_report_generator/
│
├── public/                  # Public assets used in the frontend (e.g., images, icons)
│   └── ...
│
├── src/                     # Frontend source code (likely TypeScript/HTML/CSS)
│   └── ...
│
├── app1.py                  # Flask API for scan type & body part classification
├── app2.py                  # Flask API for storing and retrieving data from a database.
│
├── bone_10                  # Trained model (likely for bone-related scan classification)
├── boneknee_20              # Trained model for knee-related conditions
├── class_2                  # Scan/body part classifier model
├── model_16                 # Disease prediction model
├── modelalzhe_4             # Model for Alzheimer's detection (likely from brain scans)
├── modelchest_19            # Model for chest X-ray diagnosis (e.g., pneumonia)
├── modelmain_3              # Combined/multi-purpose model
│
└── README.md                # Project documentation (to be created/updated)


