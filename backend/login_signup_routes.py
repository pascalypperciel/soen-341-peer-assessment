from flask import Blueprint,request,jsonify,redirect,url_for
from app import get_db_connection 
from mysql.connector import Error 

login_signup_routes = Blueprint('login_signup_routes', __name__)

@login_signup_routes.route('/studentSignup', methods=['POST'])
def studentSignup():
    #obtaining infromation from the signup form
    data= request.get_json()
    studentID=request.form[studentID]
    name=request.form[name]
    #no password hashing yet 
    password=request.form[password]

    try: 
        #connect to db
        connection= get_db_connection()
        cursor= connection.cursor()

        #query to add student to Student table using cursor
        StudentSignup_query="""
        INSERT INTO Students (StudentID, Name, Password) VALUES (%s,%s,%s)
        """
        StudentSignup_values=(studentID,name,password)

        cursor.execute(StudentSignup_query, StudentSignup_values)
        
        connection.commit()
        cursor.close()
        connection.close()

    except Error as e:
        return 'Error connecting to db'
    
    #temporary name for ratings page
    return redirect(url_for('ratingspage'))

@login_signup_routes.route('/teacherSignup', methods=['POST'])
def teacherSignup():
    #obtaining infromation from the signup form
    data= request.get_json()
    teacherID=request.form[teacherID]
    name=request.form[name]
    #no password hashing yet 
    password=request.form[password]

    try: 
        #connect to db
        connection= get_db_connection()
        cursor= connection.cursor()

        #query to add teacher to Teacher table using cursor
        TeacherSignup_query="""
        INSERT INTO Teachers (TeacherID, Name, Password) VALUES (%s,%s,%s)
        """
        TeachertSignup_values=(teacherID,name,password)

        cursor.execute(TeacherSignup_query,  TeachertSignup_values)
        
        connection.commit()
        cursor.close()
        connection.close()

    except Error as e:
        return 'Error connecting to db'
    
    #temporary name for ratings page
    return redirect(url_for('ratingspage'))

@login_signup_routes.route('studentLogin', methods=['POST'])
def studentLogin():
    data=request.get_json()
    StudentID=request.form[StudentID]
    password=request.form[password]

    try: 
        #connect to db
        connection= get_db_connection()
        cursor= connection.cursor()

        #query to verify if student with entered StudentID and Password exists
        StudentLogin_query="""
        SELECT Password FROM Students WHERE StudentID = %s
        """

        cursor.execute(StudentLogin_query, (StudentID,))
        result = cursor.fetchone()
        cursor.close()
        connection.close()

        if result:
            storedPassword=result

        if storedPassword==password:
            return redirect(url_for('ratingspage'))
        else:
# placeholder page for now 
            return 'invalid StudentID or Password'
    except Error as e:
        return 'Error connecting to db'
    
@login_signup_routes.route('teacherLogin', methods=['POST'])
def studentLogin():
    data=request.get_json()
    TeacherID=request.form[TeacherID]
    password=request.form[password]

    try: 
        #connect to db
        connection= get_db_connection()
        cursor= connection.cursor()

        #query to verify if teacher twith entered TeacherID and Password exists
        TeacherLogin_query="""
        SELECT Password FROM Teachers WHERE TeacherID = %s
        """
        cursor.execute(TeacherLogin_query, (TeacherID,))
        result = cursor.fetchone()
        cursor.close()
        connection.close()

        if result:
            storedPassword=result
#placeholder page for now 
        if storedPassword==password:
            return redirect(url_for('groupspage'))
        else:
            return 'invalid TeacherID or Password'
    except Error as e:
        return 'Error connecting to db'