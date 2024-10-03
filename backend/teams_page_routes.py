from flask import Blueprint,request,jsonify,redirect,url_for,session
from db import conn
from flask_cors import CORS
import pyodbc
from dotenv import load_dotenv

#imports for the csv reading
from io import StringIO
import csv

teams_page_routes = Blueprint('teams_page_routes', __name__)

#Method for instructor to manually create a team given specific fields 
# -> student ID manual input , group id assessed based on current inputs in db

@teams_page_routes.route('maketeamsManually', methods= ['POST'])
def make_team_manually():
     # Get the list of student IDs from the form submission (e.g., a comma-separated string or array)
    student_ids = request.form.getlist('student_ids')  # Assumes a form input named 'student_ids'
    
    #if no students return error 
    if not student_ids:
        return jsonify({"error": "No student IDs provided"}), 400

    #validate student ID entries to ensure they are INTs by parsing
    try:
        student_ids = [int(sid.strip()) for sid in student_ids if sid.strip()]
    except ValueError:
        return jsonify({"error": "Invalid student ID format"}), 400

    #db connection -> live server implementation
    cursor = conn.curso
    try:
        #Find the largest groupID such that you can increment and assign to new group
        cursor.execute("SELECT MAX(groupID) FROM StudentGroup")
        result = cursor.fetchone()

        # If there are no entries, we start from GroupID = 1, otherwise increment
        current_group_id = result[0] if result[0] is not None else 0
        new_group_id = current_group_id + 1
    
        #insert the group into the proper table 
        query = """"
        INSERT INTO StudentGroup (StudentID, GroupID)
        VALUES (%d, %d)
        """
        for student_id in student_ids:
            cursor.execute(query, (student_id, new_group_id))

        #commit the hroups to db
        conn.commit()

    except pyodbc.Error as err:
        conn.rollback()
        return jsonify({"error": f"Database error: {str(err)}"}), 500
 

    finally:
        cursor.close()
        
    return jsonify({"message": f"New team created with GroupID {new_group_id}!"}), 200



    


#Method for instructor to create a team with a csv upload 
# csv format is assumed to be studentID in each row, when there is an empty row, signaling of end of that specific team 
@teams_page_routes.route('/maketeamCSV',methods=['POST'])
def make_team_CSV():
    #get the file from the front end 
    file = request.files['file']
    #error handle if the file is not there
    if not file:
        return jsonify({"error": "No file provided"}), 400

    # Open file streams
    file_stream = StringIO(file.read().decode("utf-8"))
    csv_reader = csv.reader(file_stream)
    #create empty list to hold all teams in tupples and current_team to save the team of the itteration
    teams = []
    current_team = []
    group_id = 1  

    # read and parse the CSV file
    for row in csv_reader:
        if not row:  #if empty line, means end of team 
            if current_team:
                teams.append((current_team, group_id))
                current_team = []
                group_id += 1
        else:
            try:
                student_id = int(row[0].strip())  
                current_team.append(student_id)
            except ValueError:
                return jsonify({"error": "Invalid student ID format in file"}), 400

    if current_team:  # Add the last group if not already added
        teams.append((current_team, group_id))

    #add correct cursor connection for the live server - > this set up assumes local hosting.
    cursor = conn.cursor()
    try:
        for team, group_id in teams:
            for student_id in team:
                #query to put the teams into the db
                query = """
                INSERT INTO StudentGroup (StudentID, GroupID)
                VALUES (%s, %s)
                """
                cursor.execute(query, (student_id, group_id))
        #commit changes to DB
        conn.commit()

    except Exception as e: 
        return {'error':str(e)},500 
    finally:
        cursor.close()  
    return jsonify({"message": "Teams successfully uploaded!"}), 200


@teams_page_routes.route('/displayTeams',methods=['GET'])
def display_teams():
    #prompt the teacher to enter which class they would like to view using the course id
    data=request.get_json()
    course_id=data['courseID']

    if not course_id:
        return jsonify({"error": "courseID is required"}), 400
    
    try:
         cursor = conn.cursor()
         # find groups with matching Courseids
         grous_query="""
            SELECT GroupID FROM Groups WHERE CourseID= ?
            """
         cursor.execute(grous_query,course_id)

         #fetch all rows from the response to exctracrt the groupids with the respective courseid
         groups_result=cursor.fetchall()

         if not groups_result:
            return jsonify({"message": "No groups found for this course"}), 404
         #list of all group ids
         group_ids=[group[0] for group in groups_result]


        # Preparing list to return 
         groups_in_course = []
        #find the students with a certain group matching the course id
         for group in groups_result:
            group_id = group[0]  # Extract the GroupID
            # Query to get all students in the current group
            students_query = """
                SELECT Students.StudentID, Students.Name
                FROM Students
                JOIN StudentGroup ON Students.StudentID = StudentGroup.StudentID
                WHERE StudentGroup.GroupID = ?
            """
            cursor.execute(students_query, (group_id,))
            #fetch all rows from query result
            students_result = cursor.fetchall()

            #make a list of the students within the group
            students_in_group = [{"studentId": student[0], "name": student[1]} for student in students_result]

            #append the group to the list of groups in the class
            groups_in_course.append(students_in_group)

            #return nested list of the groups within a course
         return jsonify(groups_in_course), 200
         
    except Exception as e :
        return {'error': str(e)}, 500
    
    finally: 
        cursor.close()
        

#Method for instructor to create a team with a csv upload 
# csv format is assumed to be studentID in each row, when there is an empty row, signaling of end of that specific team 
@teams_page_routes.route('/displayStudentTeam',methods=['GET'])
def display_student_team ():
    #assume sessions implemented in login route
    if 'student_id' not in session:
        return redirect(url_for('login'))

    #assign student_id based on sessions
    student_id = session['student_id']

    try:

        cursor = conn.cursor()

        #query for groups the student is apart of
        query = """
            SELECT GroupID
            FROM StudentGroup
            WHERE StudentID = ?
        """

        cursor.excecute(query, (student_id))

        #fetch all groups student is in
        group_ids = [row[0] for row in cursor.fetchall()]

        #if no groups return message 
        if not group_ids:
            return jsonify({"message": f"No groups for this student!"}), 404
        
    #In each group find the other team members

        groups_with_students = {}
        for group_id in group_ids:
            # Query to get all students in this group
            student_query = """
                SELECT StudentID
                FROM StudentGroup
                WHERE GroupID = ?
            """
            cursor.execute(student_query, (group_id,))
            student_ids_in_group = [row[0] for row in cursor.fetchall()]

            # Add the group and its list of students
            groups_with_students[group_id] = student_ids_in_group

    except pyodbc.Error as e:
        return jsonify({"error": f"Database error: {str(e)}"}), 500

    finally:
        cursor.close()

    # Return a JSON response with the student's groups and all students in those groups
    return jsonify({"student_id": student_id, "groups_with_students": groups_with_students}), 200
