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
            Ratings.RatingID,
            Ratings.CooperationRating,
            Ratings.ConceptualContributionRating,
            Ratings.PracticalContributionRating,
            Ratings.WorkEthicRating,
            Ratings.Comment,
            Ratings.CooperationComment,
            Ratings.ConceptualContributionComment,
            Ratings.PracticalContributionComment,
            Ratings.WorkEthicComment,
            Ratings.RaterID,
            Ratings.RateeID,
            Students.Name AS RateeName,
            Groups.GroupID,
            Groups.Name AS GroupName
        FROM 
            Ratings
        JOIN 
            Groups ON Ratings.GroupID = Groups.GroupID
        JOIN 
            Courses ON Groups.CourseID = Courses.CourseID
        JOIN 
            Teachers ON Teachers.TeacherID = Courses.TeacherID
        JOIN 
            Students ON Ratings.RateeID = Students.StudentID
        WHERE 
            Teachers.TeacherID = ?;
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
