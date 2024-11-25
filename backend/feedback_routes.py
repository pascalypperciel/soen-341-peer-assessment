from flask import Blueprint,request,jsonify,redirect,url_for,session
from backend.db import conn
from dotenv import load_dotenv
import pyodbc

feedback_routes = Blueprint('feedback_routes', __name__)

@feedback_routes.route('/display_ratings', methods=['GET'])
def display_ratings():
    stud_id = request.args.get('student_id')

    if not stud_id:
        return jsonify({'error': 'Student ID is required'}), 400

    query = """
    SELECT CooperationRating, ConceptualContributionRating, PracticalContributionRating, WorkEthicRating 
    FROM Ratings
    WHERE RateeID = ?
    """
    try:
        cursor = conn.cursor()
        cursor.execute(query, (stud_id,))
        ratings = cursor.fetchall()

        # Convert ratings to a list of dictionaries
        ratings_list = [
            {
                'CooperationRating': row[0],
                'ConceptualContributionRating': row[1],
                'PracticalContributionRating': row[2],
                'WorkEthicRating': row[3],
            }
            for row in ratings
        ]
        return jsonify(ratings_list)

    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500

    finally:
        cursor.close()


@feedback_routes.route('/get_user_info', methods=['GET'])
def get_user_info():
    try:
        print("Session data:", session)  # Debug: Print session data
        if 'user_id' in session and session.get('role') == 'student':
            return jsonify({
                'user_id': session['user_id'],
                'role': session['role']
            }), 200
        else:
            print("Unauthorized access attempt")  # Debug
            return jsonify({'error': 'Unauthorized access'}), 401
    except Exception as e:
        print("Error:", str(e))  # Debug
        return jsonify({'error': str(e)}), 500
