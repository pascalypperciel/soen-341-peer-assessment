from flask import Blueprint,request,jsonify,redirect,url_for
from db import conn
from flask_cors import CORS
import pyodbc
from dotenv import load_dotenv


login_signup_routes = Blueprint('login_signup_routes', __name__)

@login_signup_routes.route('/studentSignup', methods=['POST'])
def studentSignup():
    #obtaining infromation from the signup form
    data= request.get_json()
    studentID=data['studentID']
    name=data['name']
    #no password hashing yet 
    password=data['password']

    try: 
        #connect to db
        cursor = conn.cursor()

        #query to add student to Student table using cursor
        StudentSignup_query="""
        INSERT INTO Students (StudentID, Name, Password) VALUES (?,?,?)
        """
        StudentSignup_values=(studentID,name,password)

        cursor.execute(StudentSignup_query, StudentSignup_values)
        conn.commit()
                
    except Exception as e :
        return {'error': str(e)}, 500
    
    finally:
        cursor.close()
    
    #temporary name for ratings page
    return {'message': 'Signup successful'}, 200

@login_signup_routes.route('/teacherSignup', methods=['POST'])
def teacherSignup():
    #obtaining infromation from the signup form
    data= request.get_json()
    name=data['name']
    #no password hashing yet 
    password=data['password']

    try: 
        #connect to db
        cursor = conn.cursor()

        #query to add teacher to Teacher table using cursor
        TeacherSignup_query="""
        INSERT INTO Teachers (Name, Password) VALUES (?, ?)
        """
        TeacherSignup_values=(name, password)

        cursor.execute(TeacherSignup_query, TeacherSignup_values)
        conn.commit()
        
    except Exception as e :
        return {'error': str(e)}, 500
    
    finally:
        cursor.close()
    
    #temporary name for ratings page
    return {'message': 'Signup successful'}, 200

@login_signup_routes.route('/studentLogin', methods=['GET'])
def studentLogin():
    data=request.get_json()
    StudentID=data['studentID']
    password=data['password']

    try: 
        #connect to db
        cursor = conn.cursor()

        #query to verify if student with entered StudentID and Password exists
        StudentLogin_query="""
        SELECT Password FROM Students WHERE StudentID = ?
        """

        cursor.execute(StudentLogin_query, (StudentID,))
        result = cursor.fetchone()

        if result:
            storedPassword=result[0]
            if storedPassword==password:
                return {'message': 'Login successful'}, 200
            else:
                return {'message': 'Incorrect password'}, 401
        else:
        # placeholder page for now 
            return {'message': 'Student not found'}, 401
        
    except Exception as e :
        return {'error': str(e)}, 500
    
    finally:
        cursor.close()
    
@login_signup_routes.route('/teacherLogin', methods=['GET'])
def teacherLogin():
    data=request.get_json()
    TeacherID=data['teacherID']
    password=data['password']

    try: 
        #connect to db
        cursor = conn.cursor()

        #query to verify if teacher twith entered TeacherID and Password exists
        TeacherLogin_query="""
        SELECT Password FROM Teachers WHERE TeacherID = ?
        """
        cursor.execute(TeacherLogin_query, (TeacherID,))
        result = cursor.fetchone()

        if result:
            storedPassword=result[0]
            if storedPassword==password:
                return {'message': 'Login successful'}, 200
            else:
                return {'message': 'Incorrect password'}, 401
        else:
        # placeholder page for now 
            return {'message': 'Teacher not found'}, 401
        
    except Exception as e :
        return {'error': str(e)}, 500
    
    finally:
        cursor.close()