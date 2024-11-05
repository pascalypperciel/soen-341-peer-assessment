from flask import Flask, jsonify
from flask_cors import CORS
from backend.db import conn
#blueprints
from backend.login_signup_routes import login_signup_routes
from backend.teams_page_routes import teams_page_routes 
from backend.feedback_routes import feedback_routes
from backend.ratings_routes import ratings_routes
from backend.Announcement_Endpoints import Announcement_Endpoints


app = Flask(__name__)
app.secret_key = 'SuperStrongKey'
app.register_blueprint(login_signup_routes)
app.register_blueprint(teams_page_routes)
app.register_blueprint(feedback_routes)
app.register_blueprint(ratings_routes)
app.register_blueprint(Announcement_Endpoints)

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
