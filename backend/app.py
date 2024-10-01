from flask import Flask, jsonify
from flask_cors import CORS
from db import conn
#blueprints
from login_signup_routes import login_signup_routes

app = Flask(__name__)
app.secret_key = 'SuperStrongKey'
app.register_blueprint(login_signup_routes)
CORS(app)

# The following route is a test and will be deleted soon
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
