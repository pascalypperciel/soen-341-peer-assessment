from flask import Blueprint,request,jsonify,redirect,url_for,session
from backend.db import conn
from dotenv import load_dotenv
import pyodbc

feedback_routes = Blueprint('feedback_routes', __name__)

@feedback_routes.route('/display_ratings', methods=['GET'])
def display_ratings():
    #Assuming sessionid is always student id for student login 
    stud_id = request.args.get('student_id')

    #finding all ratings associated to student id of student 
    query = """
    SELECT CooperationRating, ConceptualContributionRating, PracticalContributionRating, WorkEthicRating 
    FROM Ratings
    WHERE RateeID = %s
    """

    try:
    
        cursor = conn.cursor()
        cursor.execute(query, (stud_id,))
        ratings = cursor.fetchall()
        return jsonify(ratings)

    except Exception as e:   
        conn.rollback()
        return {'error': str(e)}, 500

    finally:
        cursor.close()

@feedback_routes.route('/get_user_info', methods=['GET'])
def get_user_info():
    try:
        if 'user_id' in session and session.get('role') == 'student':
            return jsonify({
                'user_id': session['user_id'],
                'role': session['role']
            }), 200
        else:
            return jsonify({'error': 'Unauthorized access'}), 401
    except Exception as e:
        return jsonify({'error': str(e)}), 500

