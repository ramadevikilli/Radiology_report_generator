from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
import torch.nn as nn
from torchvision import transforms
from PIL import Image

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Device configuration
device = "cuda" if torch.cuda.is_available() else "cpu"

# Define the model class
class MyModel(nn.Module):
    def __init__(self, num_classes):
        super(MyModel, self).__init__()
        self.conv1 = nn.Conv2d(3, 32, kernel_size=4)
        self.bn1 = nn.BatchNorm2d(32)
        self.conv2 = nn.Conv2d(32, 64, kernel_size=4)
        self.bn2 = nn.BatchNorm2d(64)
        self.conv3 = nn.Conv2d(64, 128, kernel_size=4)
        self.bn3 = nn.BatchNorm2d(128)
        self.conv4 = nn.Conv2d(128, 128, kernel_size=4)
        self.bn4 = nn.BatchNorm2d(128)
        self.pool = nn.MaxPool2d(kernel_size=3, stride=3)
        self.pool2 = nn.MaxPool2d(kernel_size=3, stride=2)
        self.flatten = nn.Flatten()
        self.fc1 = nn.Linear(6 * 6 * 128, 512)
        self.fc2 = nn.Linear(512, num_classes)
        self.relu = nn.ReLU()
        self.dropout = nn.Dropout(0.5)

    def forward(self, x):
        x = self.relu(self.bn1(self.conv1(x)))
        x = self.pool(x)
        x = self.relu(self.bn2(self.conv2(x)))
        x = self.pool(x)
        x = self.relu(self.bn3(self.conv3(x)))
        x = self.pool2(x)
        x = self.relu(self.bn4(self.conv4(x)))
        x = self.flatten(x)
        x = self.relu(self.fc1(x))
        x = self.dropout(x)
        return self.fc2(x)

# Transform for preprocessing
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406],
                         std=[0.229, 0.224, 0.225]),
])

# Classification model paths and labels
disease_model_paths = {
    "Bone_Fracture_Binary_Classification": r"C:\Users\RAMA\Desktop\Flaskapi\bone_10",
    "brain-tumor": r"C:\Users\RAMA\Desktop\Flaskapi\model_16",
    "bone": r"C:\Users\RAMA\Desktop\Flaskapi\boneknee_20",
    "alzheimer_mri": r"C:\Users\RAMA\Desktop\Flaskapi\modelalzhe_4",
    "chest": r"C:\Users\RAMA\Desktop\Flaskapi\modelchest_19",
}

disease_labels = {
    "Bone_Fracture_Binary_Classification": ["fractured", "not fractured"],
    "brain-tumor": ["Glioma", "Pituitary", "Meningioma", "No Tumor", "Other"],
    "bone": ["Osteoporosis", "Normal", "Osteopenia"],
    "alzheimer_mri": ["Non Demented", "Mild Dementia", "Very Mild Dementia", "Moderate Dementia"],
    "chest": ["TUBERCULOSIS", "NORMAL", "PNEUMONIA"],
}

body_part_labels = {
    0: "Bone_Fracture_Binary_Classification",
    1: "brain-tumor",
    2: "bone",
    3: "alzheimer_mri",
    4: "chest"
}

# Helper functions
def preprocess_image(file):
    image = Image.open(file).convert("RGB")
    return transform(image).unsqueeze(0).to(device)

def predict_model(image_tensor, model_path, num_classes):
    model = MyModel(num_classes=num_classes).to(device)
    model.load_state_dict(torch.load(model_path, map_location=device))
    model.eval()
    with torch.no_grad():
        outputs = model(image_tensor)
        _, predicted = torch.max(outputs, 1)
    return predicted.item()

# API Endpoint
@app.route('/api/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files['file']
    override_model = request.form.get('model', None)

    image_tensor = preprocess_image(file)

    # Override path if model manually selected
    if override_model and override_model in disease_model_paths:
        model_path = disease_model_paths[override_model]
        labels = disease_labels[override_model]
        prediction_index = predict_model(image_tensor, model_path, len(labels))
        return jsonify({"model": override_model, "prediction": labels[prediction_index]})

    # Auto-detect type: X-ray/CT or Other
    type_model_path = r"C:\Users\RAMA\Desktop\Flaskapi\modelmain_3"
    type_pred = predict_model(image_tensor, type_model_path, 2)

    # Return X-ray/CT prediction
    if type_pred == 0:
        scan_type = "X-rayctscan"
    else:
       
        return jsonify({
        "scan_type": 'please upload correct xray/ctscan',
        "body_part": 'none',
        "disease": 'none',
        "status": "success"
       })
        
    
    # Predict body part
    body_model_path = r"C:\Users\RAMA\Desktop\Flaskapi\class_2"
    body_index = predict_model(image_tensor, body_model_path, 5)
    body_part = body_part_labels[body_index]

    # Predict disease based on body part
    disease_path = disease_model_paths[body_part]
    labels = disease_labels[body_part]
    disease_index = predict_model(image_tensor, disease_path, len(labels))
    disease = labels[disease_index]

    return jsonify({
        "scan_type": scan_type,
        "body_part": body_part,
        "disease": disease,
        "status": "success"
    })

# Run Flask server
if __name__ == '__main__':
    app.run(debug=True, port=5003) 