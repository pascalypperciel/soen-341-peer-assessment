from flask import Blueprint,request,jsonify,redirect,url_for,session,render_template
from backend.db import conn
from dotenv import load_dotenv
import pyodbc


instructor_dashboard_routes = Blueprint('instructor_dashboard_routes', __name__)


#this route retrieves all ratings associated to all the students in their course
@instructor_dashboard_routes.route('/getStudentRatings', methods=['GET'])
def get_student_ratings():
    # Get the teacher ID from the session id 
    teacher_id = session.get('teacher_id')

    if not teacher_id:
        return jsonify({"error": "Teacher not logged in!"}), 401

    try:
        cursor = conn.cursor()

        # Query for ratings related to the teacher's courses
        query = """
        SELECT 
            Ratings.RatingID,
            Ratings.CooperationRating,
            Ratings.ConceptualContributionRating,
            Ratings.PracticalContributionRating,
            Ratings.WorkEthicRating,
            Ratings.Comment,
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
            Students ON Ratings.RateeID = Students.StudentID
        WHERE 
            Courses.TeacherID = ?;
        """
        
        # Execute the query with the teacher_id parameter
        cursor.execute(query, (teacher_id,))
        result = cursor.fetchall()

        # If no ratings are found, return a message
        if not result:
            return jsonify({"message": "No ratings have been given!"}), 404

        # Process the result to create the JSON response
        ratings = []
        for row in result:
            ratings.append({
                "rating_id": row["RatingID"],
                "cooperation_rating": row["CooperationRating"],
                "conceptual_contribution_rating": row["ConceptualContributionRating"],
                "practical_contribution_rating": row["PracticalContributionRating"],
                "work_ethic_rating": row["WorkEthicRating"],
                "comment": row["Comment"],
                "rater_id": row["RaterID"],
                "ratee_id": row["RateeID"],
                "ratee_name": row["RateeName"],
                "group_id": row["GroupID"],
                "group_name": row["GroupName"]
            })

        return jsonify(ratings), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        cursor.close()



@instructor_dashboard_routes.route('/getStudentRatingsTEST', methods=['GET'])
def get_student_ratings_TEST():
    teacher_id = 1 

    if not teacher_id:
        return jsonify({"error": "Teacher not logged in!"}), 401

    try:
        cursor = conn.cursor()

        # Query for ratings related to the teacher's courses
        query = """
        SELECT 
            Ratings.RatingID,
            Ratings.CooperationRating,
            Ratings.ConceptualContributionRating,
            Ratings.PracticalContributionRating,
            Ratings.WorkEthicRating,
            Ratings.Comment,
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
            Students ON Ratings.RateeID = Students.StudentID
        WHERE 
            Courses.TeacherID = ?;
        """
        
        # Execute the query with the teacher_id parameter
        cursor.execute(query, (teacher_id,))
        result = cursor.fetchall()

        # If no ratings are found, return a message
        if not result:
            return jsonify({"message": "No ratings have been given!"}), 404

        # Process the result to create the JSON response
        ratings = []
        for row in result:
            ratings.append({
                "rating_id": row["RatingID"],
                "cooperation_rating": row["CooperationRating"],
                "conceptual_contribution_rating": row["ConceptualContributionRating"],
                "practical_contribution_rating": row["PracticalContributionRating"],
                "work_ethic_rating": row["WorkEthicRating"],
                "comment": row["Comment"],
                "rater_id": row["RaterID"],
                "ratee_id": row["RateeID"],
                "ratee_name": row["RateeName"],
                "group_id": row["GroupID"],
                "group_name": row["GroupName"]
            })

        return jsonify(ratings), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        cursor.close()
