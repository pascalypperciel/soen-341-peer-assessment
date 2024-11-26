from flask import Blueprint, request
import pyodbc
from backend.db import driver, server, database, username, password

Announcement_Endpoints = Blueprint('Announcement_Endpoints', __name__)
# Get database connection to execute queries
def get_connection():
    return pyodbc.connect(
        f"DRIVER={driver};SERVER={server};PORT=1433;DATABASE={database};UID={username};PWD={password}"
    )


@Announcement_Endpoints.route('/Create_Announcement', methods=['POST'])
def Create_Announcement():
    data = request.get_json()

    if not data or 'courseID' not in data or 'announcement' not in data:
        return {'error': 'Missing required fields'}, 400
    
    Course_id = data['courseID']
    Announcement = data['announcement']
    try:
        conn = get_connection()
        cursor = conn.cursor()
        
        # Query to add announcement to announcement table. Allows for announcements to be
        # Refrenced and displayed
        query = '''
        INSERT INTO Announcement (Announcement, CourseID)
        VALUES (?, ?)
        '''
        cursor.execute(query, (Announcement, Course_id))
        conn.commit()
        return {'message': 'Announcement Successfully added'}, 200
            
    except Exception as e:
        print("Error:", e)
        return {'error': str(e)}, 500
    
    finally:
        cursor.close()
        conn.close()


@Announcement_Endpoints.route('/get_Announcements_Teachers', methods=['GET'])
def get_Announcements_Teachers():
    Teacher_id = request.args.get('Teacher_id')
    try:
        conn = get_connection()
        cursor = conn.cursor()
        # Query to acess all announcements generated by the entered teacherID

        query = '''
        SELECT Announcement, A.CourseID, AnnouncementID, C.Name, A.Timestamp
        FROM Announcement A
        JOIN Courses C ON A.CourseID = C.CourseID
        WHERE C.TeacherID = ?;
        '''
        cursor.execute(query, (Teacher_id,))
        announcements = cursor.fetchall()

        announcements_list = [{'Announcement': row[0], 'CourseID': row[1], 'AnnouncementID': row[2], 'CourseName': row[3], 'Timestamp': row[4]} for row in announcements]

        # return 404 if list is null 
        if isinstance(announcements_list, list) and len(announcements_list) == 0:
            return {'error': 'No announcements found for the given teacher ID'}, 404
        
        return {'announcements': announcements_list, 'message': 'Announcements Successfully returned'}, 200

    except Exception as e:
        print("Error:", e)
        return {'error': str(e)}, 500
    
    finally:
        cursor.close()
        conn.close()
    

@Announcement_Endpoints.route('/get_Announcements_Students', methods=['GET'])
def get_Announcements_Students(): 
    Student_id = request.args.get('student_id')
    try:
        conn = get_connection()
        cursor = conn.cursor()
        # Query to obtaind all announcements for students in a given course 
        query = '''
        SELECT A.Announcement, C.CourseID, C.Name, A.Timestamp
        FROM Students S
        JOIN StudentGroup SG ON S.StudentID = SG.StudentID
        JOIN Groups G ON SG.GroupID = G.GroupID
        JOIN Courses C ON G.CourseID = C.CourseID
        JOIN Announcement A ON C.CourseID = A.CourseID
        WHERE S.StudentID = ?;
        '''

        # Execute the statement to obtain result from SQL server 
        cursor.execute(query, (Student_id,))
        announcements = cursor.fetchall()

        # Make format of response readable and interperatable by front end dev 
        announcements_list = [{'Announcement': row[0], 'CourseID': row[1], 'CourseName': row[2], 'Timestamp': row[3]} for row in announcements]

        # return 404 if list is null 
        if isinstance(announcements_list, list) and len(announcements_list) == 0:
            return {'error': 'No announcements found for the given student ID'}, 404

        return {'announcements': announcements_list, 'message': 'Announcements Successfully returned'}, 200
    
    except Exception as e:
        print("Error:", e)
        return {'error': str(e)}, 500
    
    finally:
        cursor.close()
        conn.close()


@Announcement_Endpoints.route('/Update_Announcement', methods=['PUT'])
def Update_Announcement():
    data = request.get_json()

    if not data or 'courseID' not in data or 'announcement' not in data or 'announcementID' not in data:
        return {'error': 'Missing required fields'}, 400
    
    Course_id = data['courseID']
    Announcement = data['announcement']
    AnnouncementID = data['announcementID']
    try:
        conn = get_connection()
        cursor = conn.cursor()
        # Update query to change announcement based on user entered course id, announcement, and announcementIdd
        query = '''
        UPDATE Announcement
        SET Announcement = ?, CourseID = ?
        WHERE AnnouncementID = ?;
        '''
        cursor.execute(query, (Announcement, Course_id, AnnouncementID))
        conn.commit()
        return {'message': 'Announcement Successfully updated'}, 200
    
    except Exception as e:
        print("Error:", e)
        return {'error': str(e)}, 500
    
    finally:
        cursor.close()
        conn.close()
