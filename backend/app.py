from flask import Flask
from flask_cors import CORS
# blueprints
from backend.routes.login_signup_routes import login_signup_routes
from backend.routes.teams_routes import teams_page_routes
from backend.routes.feedback_routes import feedback_routes
from backend.routes.ratings_routes import ratings_routes
from backend.routes.announcement_routes import Announcement_Endpoints
from backend.routes.instructor_dashboard_routes import instructor_dashboard_routes

app = Flask(__name__)
app.secret_key = 'SuperStrongKey'
app.register_blueprint(login_signup_routes)
app.register_blueprint(teams_page_routes)
app.register_blueprint(feedback_routes)
app.register_blueprint(ratings_routes)
app.register_blueprint(Announcement_Endpoints)
app.register_blueprint(instructor_dashboard_routes)

CORS(app)

if __name__ == "__main__":
    app.run(debug=True)
