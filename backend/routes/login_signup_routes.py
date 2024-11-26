from flask import Blueprint, request, session, jsonify
from backend.db import conn
from werkzeug.security import generate_password_hash, check_password_hash


login_signup_routes = Blueprint('login_signup_routes', __name__)


@login_signup_routes.route('/studentSignup', methods=['POST'])
def student_signup():
    # obtaining infromation from the signup form
    data = request.get_json()
    studentID = data['studentID']
    name = data['name']
    # no password hashing yet
    password = data['password']
                    
    try:
        # connect to db
        cursor = conn.cursor()
        hashed_password = generate_password_hash(password)

        # query to add student to Student table using cursor
        student_signup_query = """
        INSERT INTO Students (StudentID, Name, Password) VALUES (?,?,?)
        """
        student_signup_values = (studentID, name, hashed_password)

        cursor.execute(student_signup_query, student_signup_values)
        conn.commit()

    except Exception as e:
        print("Error:", e)
        return {'error': str(e)}, 500
    
    finally:
        cursor.close()
    
    # temporary name for ratings page
    return {'message': 'Signup successful'}, 200


@login_signup_routes.route('/teacherSignup', methods=['POST'])
def teacher_signup():
    # obtaining infromation from the signup form
    data = request.get_json()
    name = data['name']
    username = data['username']
    # no password hashing yet
    password = data['password']

    try:
        # connect to db
        cursor = conn.cursor()
        hashed_password = generate_password_hash(password)

        # query to add teacher to Teacher table using cursor
        teacher_signup_query = """
        INSERT INTO Teachers (Name, Password, Username) VALUES (?, ?, ?)
        """
        teacher_signup_values = (name, hashed_password, username)

        cursor.execute(teacher_signup_query, teacher_signup_values)
        conn.commit()
        
    except Exception as e:
        print("Error:", e)
        return {'error': str(e)}, 500
    
    finally:
        cursor.close()
    
    # temporary name for ratings page
    return {'message': 'Signup successful'}, 200


@login_signup_routes.route('/studentLogin', methods=['GET'])
def student_login():
    student_id = request.args.get('studentID')
    password = request.args.get('password')

    try:
        # connect to db
        cursor = conn.cursor()

        # query to verify if student with entered StudentID and Password exists
        student_login_query = """
        SELECT Password FROM Students WHERE StudentID = ?
        """

        cursor.execute(student_login_query, (student_id,))
        result = cursor.fetchone()

        if result:
            stored_password = result[0]
            # use hash checker to verify
            if check_password_hash(stored_password, password):

                # store the stud ID in a session once logged in
                session['student_id'] = student_id

                return {'message': 'Login successful', 'student_id': student_id}, 200
            else:
                return {'message': 'Incorrect password'}, 401
        else:
            # placeholder page for now
            return {'message': 'Student not found'}, 401

    except Exception as e:
        print("Error:", e)
        return {'error': str(e)}, 500
    
    finally:
        cursor.close()
    

@login_signup_routes.route('/teacherLogin', methods=['GET'])
def teacher_login():
    username = request.args.get('username')
    password = request.args.get('password')

    try:
        # connect to db
        cursor = conn.cursor()

        # query to verify if teacher with entered Username and Password exists
        teacher_login_query = """
        SELECT Password, TeacherID FROM Teachers WHERE Username = ?
        """
        cursor.execute(teacher_login_query, (username,))
        result = cursor.fetchone()

        if result:
            stored_password = result[0]
            teacher_id = result[1]
            session['teacher_id'] = teacher_id
            # use hash checker to verify
            if check_password_hash(stored_password, password):
                return {'message': 'Login successful', 'teacher_id': teacher_id}, 200
            else:
                return {'message': 'Incorrect password'}, 401
        else:
            return {'message': 'Teacher not found'}, 401

    except Exception as e:
        print("Error:", e)
        return {'error': str(e)}, 500

    finally:
        cursor.close()


@login_signup_routes.route('/logout', methods=['GET'])
def logout():
    session.pop('student_id', None)
    session.pop('teacher_id', None)
    return {'message': 'Logged out!'}, 200


# This route intakes the studentID to update their password in the DB
@login_signup_routes.route('/changeStudentPassword', methods=['PUT'])
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
@login_signup_routes.route('/changeTeacherPassword', methods=['PUT'])
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
