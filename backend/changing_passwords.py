from flask import Blueprint,request,jsonify,redirect,url_for,session
from backend.db import conn
from dotenv import load_dotenv
from werkzeug.security import generate_password_hash

change_passwords_routes = Blueprint('change_passwords_routes', __name__)

# This route intakes the studentID to update their password in the DB
@change_passwords_routes.route('/changeStudentPassword/<int:student_id>', methods=['PUT'])
def change_student_password(student_id):
    try:
        # Get the new password from the request
        new_student_password = request.json.get('new_student_password')

        if not new_student_password:
            return jsonify({"error": "Need to enter a new password!"}), 401

        # Hash the new password
        hashed_password = generate_password_hash(new_student_password)

        # Connect to the database
        cursor = conn.cursor()

        # Check if the student exists
        cursor.execute("SELECT * FROM Students WHERE StudentID = ?", (student_id,))
        student = cursor.fetchone()

        if not student:
            return jsonify({"error": "Student not found"}), 404

        # Update the student's password
        cursor.execute(
            "UPDATE Students SET Password = ? WHERE StudentID = ?",
            (hashed_password, student_id)
        )
        conn.commit()

        return jsonify({"message": "Password updated successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            cursor.close()
            conn.close()

# This route intakes the teacherID to update their password in the DB
@change_passwords_routes.route('/changeTeacherPassword/<int:teacher_id>', methods=['PUT'])
def change_teacher_password(teacher_id):
    try:
        # Get the new password from front end 
        new_teacher_password = request.json.get('new_teacher_password')
        #if no password passed end the interaction
        if not new_teacher_password:
            return jsonify({"error": "Need to enter a new password!"}), 401

        # Hash new password
        hashed_password = generate_password_hash(new_teacher_password)

        # Connect to db
        cursor = conn.cursor()

        # Check if the teacher exists
        cursor.execute("SELECT * FROM Teachers WHERE TeacherID = ?", (teacher_id,))
        teacher = cursor.fetchone()

        if not teacher:
            return jsonify({"error": "Teacher not found"}), 404

        # Update the teacher password
        cursor.execute(
            "UPDATE Teachers SET Password = ? WHERE TeacherID = ?",
            (hashed_password, teacher_id)
        )
        conn.commit()

        return jsonify({"message": "Password updated successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            cursor.close()
            conn.close()
