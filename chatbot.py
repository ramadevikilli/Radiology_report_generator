from flask import Flask, request, jsonify, session
from flask_cors import CORS
import pandas as pd
import numpy as np
from sklearn.tree import DecisionTreeClassifier
from sklearn import preprocessing
import csv
import warnings
warnings.filterwarnings("ignore", category=DeprecationWarning)

app = Flask(__name__)
CORS(app)
app.secret_key = 'your_secret_key_here'

# Load and preprocess training data
training = pd.read_csv('Training.csv')
cols = training.columns[:-1]
x = training[cols]
y = training['prognosis']

le = preprocessing.LabelEncoder()
le.fit(y)
y = le.transform(y)

clf = DecisionTreeClassifier().fit(x, y)

# Load dictionaries
severityDictionary = {}
description_list = {}
precautionDictionary = {}
symptoms_dict = {symptom: index for index, symptom in enumerate(cols)}

def getDescription():
    with open('symptom_Description.csv') as f:
        reader = csv.reader(f)
        for row in reader:
            if row:
                description_list[row[0]] = row[1]

def getSeverityDict():
    with open('symptom_severity.csv') as f:
        reader = csv.reader(f)
        for row in reader:
            if len(row) >= 2:
                try:
                    severityDictionary[row[0]] = int(row[1])
                except ValueError:
                    continue

def getPrecautionDict():
    with open('symptom_precaution.csv') as f:
        reader = csv.reader(f)
        for row in reader:
            precautionDictionary[row[0]] = row[1:]

@app.route('/start_conversation', methods=['GET'])
def start_conversation():
    session.clear()
    return jsonify({"message": "Hello, what's your name?"})

@app.route('/get_symptoms', methods=['POST'])
def get_symptoms():
    data = request.get_json()
    session['name'] = data.get('name', '')
    session['symptoms'] = []
    return jsonify({
        "message": " Please enter the symptom you are experiencing.",
        "symptoms": list(symptoms_dict.keys())
    })

@app.route('/confirm_symptom', methods=['POST'])
def confirm_symptom():
    data = request.get_json()
    symptom = data.get('symptom', '')
    if symptom:
        session.setdefault('symptoms', []).append(symptom)
        return jsonify({
            "message": "Symptom confirmed. Please enter how many days you've had it."
        })
    return jsonify({"message": "No symptom received."}), 400

@app.route('/confirm_days', methods=['POST'])
def confirm_days():
    try:
        data = request.get_json()
        days = int(data.get('days', 0))
        session['days'] = days
        return jsonify({
            "message": "Thanks! Now predicting your condition...",
            "symptoms": session.get('symptoms', [])
        })
    except Exception as e:
        print("Error in /confirm_days:", e)
        return jsonify({"message": "Something went wrong."}), 500

@app.route('/final_prediction', methods=['POST'])
def final_prediction():
    data = request.get_json()
    additional_symptoms = data.get('additional_symptoms', [])
    all_symptoms = session.get('symptoms', []) + additional_symptoms
    days = session.get('days', 1)

    x_test = [0] * len(symptoms_dict)

    # Enhance logic: Add severity weight based on duration
    for symptom in all_symptoms:
        if symptom in symptoms_dict:
            severity = severityDictionary.get(symptom, 1)
            weighted_value = severity * min(days, 7)  # Cap duration to 7 to avoid over-bias
            x_test[symptoms_dict[symptom]] = weighted_value

    prediction = clf.predict([x_test])
    disease = le.inverse_transform(prediction)[0]

    return jsonify({
        "predicted_disease": disease,
        "description": description_list.get(disease, "No description available."),
        "precautions": precautionDictionary.get(disease, ["No precautions available."]),
        "advice": "Please consult a healthcare provider."
    })

if __name__ == '__main__':
    getDescription()
    getSeverityDict()
    getPrecautionDict()
    app.run(debug=True)
