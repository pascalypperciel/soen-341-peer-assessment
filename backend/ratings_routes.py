from flask import Blueprint,request,jsonify,redirect,url_for,session
from backend.db import conn
from dotenv import load_dotenv
import pyodbc

ratings_routes = Blueprint('ratings_routes', __name__)

@ratings_routes.route('/display_ratings', methods=['GET'])
def display_ratings():
    stud_id = session['session_id']

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


    

    




