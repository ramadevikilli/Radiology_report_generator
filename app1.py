from flask import Flask, request, jsonify
from flask_cors import CORS
import pyodbc

app = Flask(__name__)
CORS(app)

# Function to connect to SQL Server
def get_db_connection():
    return pyodbc.connect(
        'DRIVER={ODBC Driver 17 for SQL Server};'
        'SERVER=DESKTOP-VQ20GIV\\SQLEXPRESS;'
        'DATABASE=Radiology;'
        'Trusted_Connection=yes;'
    )

@app.route('/api/employees', methods=['POST'])
def add_employee():
    try:
        data = request.get_json()

        firstname = data['firstname']
        lastname = data['lastname']
        email = data['email']
        phone = data['phone']
        password = data['password']

        conn = get_db_connection()
        cursor = conn.cursor()

        # Check if email already exists
        cursor.execute("SELECT COUNT(*) FROM Employees WHERE Email = ?", (email,))
        result = cursor.fetchone()
        if result[0] > 0:
            return jsonify({'error': 'Email already exists'}), 409

        # Insert new employee if email doesn't exist
        cursor.execute("""
            INSERT INTO Employees (FirstName, LastName, Email, Phone, Password)
            VALUES (?, ?, ?, ?, ?)
        """, firstname, lastname, email, phone, password)

        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({'message': 'Employee added successfully'}), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500
@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("SELECT * FROM Employees WHERE Email = ? AND Password = ?", (email, password))
        user = cursor.fetchone()

        cursor.close()
        conn.close()

        if user:
            return jsonify({'message': 'Login successful', 'email': email}), 200
        else:
            return jsonify({'error': 'Invalid email or password'}), 401

    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5001)
