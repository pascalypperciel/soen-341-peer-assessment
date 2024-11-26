from flask import Blueprint, request, jsonify
from backend.db import conn
from werkzeug.security import generate_password_hash

change_passwords_routes = Blueprint('change_passwords_routes', __name__)


# This route intakes the studentID to update their password in the DB
@change_passwords_routes.route('/changeStudentPassword', methods=['PUT'])
def change_student_password():
    try:
        # Get the new password from the request
        student_id = request.json.get('student_id')
        new_student_password = request.json.get('new_password')

        if not new_student_password:
            return jsonify({"error": "Need to enter a new password!"}), 401

        # Hash the new password for added security
        hashed_password = generate_password_hash(new_student_password)

        # Connect to the database to access and change old password
        cursor = conn.cursor()

        # Check if the student exists inside db to be changed
        cursor.execute("SELECT * FROM Students WHERE StudentID = ?", (student_id,))
        student = cursor.fetchone()

        if not student:
            return jsonify({"error": "Student not found"}), 404

        # Update the student's password with hash for added security
        cursor.execute(
            "UPDATE Students SET Password = ? WHERE StudentID = ?",
            (hashed_password, student_id)
        )
        conn.commit()

        return jsonify({"message": "Password updated successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if cursor:
            cursor.close()
            


# This route intakes the teacherID to update their password in the DB with a hash for security
@change_passwords_routes.route('/changeTeacherPassword', methods=['PUT'])
def change_teacher_password():
    try:
        # Get the new password from front end to be hashed and out in db
        username = request.json.get('username')
        new_teacher_password = request.json.get('new_password')
        
        # if no password passed end the interaction to not make any unwanted change
        if not new_teacher_password:
            return jsonify({"error": "Need to enter a new password!"}), 401

        # Hash new password for added security
        hashed_password = generate_password_hash(new_teacher_password)

        # Connect to db to change the password
        cursor = conn.cursor()

        # Check if the teacher exists to update their password
        cursor.execute("SELECT * FROM Teachers WHERE Username = ?", (username,))
        teacher = cursor.fetchone()

        if not teacher:
            return jsonify({"error": "Teacher not found"}), 404

        # Update the teacher password with the hash for added security
        cursor.execute(
            "UPDATE Teachers SET Password = ? WHERE Username = ?",
            (hashed_password, username)
        )
        conn.commit()

        return jsonify({"message": "Password updated successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if cursor:
            cursor.close()
            
