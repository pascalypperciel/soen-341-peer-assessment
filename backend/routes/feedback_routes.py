from flask import Blueprint, request, jsonify
from backend.db import conn

feedback_routes = Blueprint('feedback_routes', __name__)


@feedback_routes.route('/display_ratings', methods=['GET'])
def display_ratings():
    # Assuming sessionid is always student id for student login
    student_id = request.args.get('student_id')

    # finding all ratings associated to student id of student

    query = """
    SELECT r.CooperationComment, r.ConceptualContributionComment, r.PracticalContributionComment, r.WorkEthicComment, g.Name
    FROM Ratings r
    LEFT JOIN Groups g ON g.GroupID = r.GroupID
    WHERE RateeID = ?
    """
    try:
        cursor = conn.cursor()
        cursor.execute(query, (student_id,))
        rows = cursor.fetchall()
        ratings = [
            {
                "CooperationComment": row.CooperationComment,
                "ConceptualContributionComment": row.ConceptualContributionComment,
                "PracticalContributionComment": row.PracticalContributionComment,
                "WorkEthicComment": row.WorkEthicComment,
                "GroupName": row.Name,
            }
            for row in rows
        ]
        return jsonify(ratings)

    except Exception as e:
        conn.rollback()
        return {'error': str(e)}, 500

    finally:
        cursor.close()
    