from flask import Blueprint,request,jsonify,redirect,url_for,session,render_template
from backend.db import conn
from dotenv import load_dotenv
import pyodbc



instructor_dashboard_routes = Blueprint('instructor_dashboard_routes', __name__)


def fetch_as_dict(cursor):
    columns = [column[0] for column in cursor.description]
    return [dict(zip(columns, row)) for row in cursor.fetchall()]


#this route retrieves all ratings associated to all the students in their course
@instructor_dashboard_routes.route('/getStudentRatings', methods=['GET'])
def get_student_ratings():
    # Use a placeholder teacher_id for testing
    teacher_id = request.args.get('teacher_id')

    if not teacher_id:
        return jsonify({"error": "Teacher not logged in!"}), 401

    try:
        cursor = conn.cursor()

        query = """
        SELECT 
            r.RatingID,
            r.CooperationRating,
            r.ConceptualContributionRating,
            r.PracticalContributionRating,
            r.WorkEthicRating,
            r.Comment,
            r.CooperationComment,
            r.ConceptualContributionComment,
            r.PracticalContributionComment,
            r.WorkEthicComment,
            r.RaterID,
            r.RateeID,
            ratee.Name AS RateeName,
            rater.Name AS RaterName,
            g.GroupID,
            g.Name AS GroupName
        FROM 
            Ratings r
        JOIN 
            Groups g ON r.GroupID = g.GroupID
        JOIN 
            Courses c ON g.CourseID = c.CourseID
        JOIN 
            Teachers t ON t.TeacherID = c.TeacherID
        JOIN 
            Students ratee ON r.RateeID = ratee.StudentID
        JOIN 
            Students rater ON r.RaterID = rater.StudentID
        WHERE 
            t.TeacherID = ?;
        """
        
        # Execute the query with the teacher_id parameter
        cursor.execute(query, (teacher_id,))

        # Use the helper function to fetch results as dictionaries
        ratings = fetch_as_dict(cursor)

        return jsonify(ratings), 200

    except Exception as e:
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500

    finally:
        cursor.close()
