from flask import Flask, jsonify
from flask_cors import CORS
import pyodbc
import os
from dotenv import load_dotenv

app = Flask(__name__)
CORS(app)

# Database stuff
load_dotenv()
server = os.getenv('DB_SERVER')
database = os.getenv('DB_DATABASE')
username = os.getenv('DB_USERNAME')
password = os.getenv('DB_PASSWORD')
driver = os.getenv('DB_DRIVER')

conn = pyodbc.connect(
    'DRIVER=' + driver + ';SERVER=' + server + ';PORT=1433;DATABASE=' + database + ';UID=' + username + ';PWD=' + password
)

@app.route('/get-data', methods=['GET'])
def get_data():
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM Students") 
    rows = cursor.fetchall()

    data = []
    for row in rows:
        data.append(dict(zip([column[0] for column in cursor.description], row)))

    return jsonify(data)

if __name__ == "__main__":
    app.run(debug=True)
