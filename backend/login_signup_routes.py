from flask import Blueprint,request,jsonify,redirect,url_for,session
from backend.db import conn
from dotenv import load_dotenv

login_signup_routes = Blueprint('login_signup_routes', __name__)

@login_signup_routes.route('/studentSignup', methods=['POST'])
def studentSignup():
    # obtaining infromation from the signup form
    data= request.get_json()
    studentID=data['studentID']
    name=data['name']
    # no password hashing yet 
    password=data['password']

    try: 
        # connect to db
        cursor = conn.cursor()

        # query to add student to Student table using cursor
        StudentSignup_query="""
        INSERT INTO Students (StudentID, Name, Password) VALUES (?,?,?)
        """
        StudentSignup_values=(studentID,name,password)

        cursor.execute(StudentSignup_query, StudentSignup_values)
        conn.commit()
        

    except Exception as e :
        print("Error:", e)
        return {'error': str(e)}, 500
    
    finally:
        cursor.close()
    
    # temporary name for ratings page
    return {'message': 'Signup successful'}, 200

@login_signup_routes.route('/teacherSignup', methods=['POST'])
def teacherSignup():
    # obtaining infromation from the signup form
    data= request.get_json()
    name=data['name']
    username=data['username']
    # no password hashing yet 
    password=data['password']

    try: 
        # connect to db
        cursor = conn.cursor()

        # query to add teacher to Teacher table using cursor
        TeacherSignup_query="""
        INSERT INTO Teachers (Name, Password, Username) VALUES (?, ?, ?)
        """
        TeacherSignup_values=(name, password, username)

        cursor.execute(TeacherSignup_query, TeacherSignup_values)
        conn.commit()
        
    except Exception as e :
        print("Error:", e)
        return {'error': str(e)}, 500
    
    finally:
        cursor.close()
    
    # temporary name for ratings page
    return {'message': 'Signup successful'}, 200

@login_signup_routes.route('/studentLogin', methods=['GET'])
def studentLogin():
    StudentID = request.args.get('studentID')
    password = request.args.get('password')

    try: 
        # connect to db
        cursor = conn.cursor()

        # query to verify if student with entered StudentID and Password exists
        StudentLogin_query="""
        SELECT Password FROM Students WHERE StudentID = ?
        """

        cursor.execute(StudentLogin_query, (StudentID,))
        result = cursor.fetchone()

        if result:
            storedPassword=result[0]
            if storedPassword==password:

                # store the stud ID in a session once logged in
                session['student_id']= StudentID

                return {'message': 'Login successful', 'student_id': StudentID}, 200
            else:
                return {'message': 'Incorrect password'}, 401
        else:
        # placeholder page for now 
            return {'message': 'Student not found'}, 401
        
    except Exception as e :
        print("Error:", e)
        return {'error': str(e)}, 500
    
    finally:
        cursor.close()
    
@login_signup_routes.route('/teacherLogin', methods=['GET'])
def teacherLogin():
    username = request.args.get('username')
    password = request.args.get('password')

    try: 
        # connect to db
        cursor = conn.cursor()

        # query to verify if teacher with entered Username and Password exists
        TeacherLogin_query = """
        SELECT Password, TeacherID FROM Teachers WHERE Username = ?
        """
        cursor.execute(TeacherLogin_query, (username,))
        result = cursor.fetchone()

        if result:
            storedPassword = result[0]
            teacher_id = result[1]
            session['teacher_id']= teacher_id
            
            if storedPassword == password:
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
