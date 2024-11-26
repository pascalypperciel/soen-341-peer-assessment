from flask import Blueprint, request
import pyodbc
from backend.db import driver, server, database, username, password

announcement_routes = Blueprint('announcement_routes', __name__)


def get_connection():
    return pyodbc.connect(
        f"DRIVER={driver};SERVER={server};PORT=1433;DATABASE={database};UID={username};PWD={password}"
    )


@announcement_routes.route('/Create_Announcement', methods=['POST'])
def create_announcement():
    data = request.get_json()

    if not data or 'courseID' not in data or 'announcement' not in data:
        return {'error': 'Missing required fields'}, 400
    
    course_id = data['courseID']
    announcement = data['announcement']
    try:
        conn = get_connection()
        cursor = conn.cursor()
        query = '''
        INSERT INTO Announcement (Announcement, CourseID)
        VALUES (?, ?)
        '''
        cursor.execute(query, (announcement, course_id))
        conn.commit()
        return {'message': 'Announcement Successfully added'}, 200
            
    except Exception as e:
        print("Error:", e)
        return {'error': str(e)}, 500
    
    finally:
        cursor.close()
        conn.close()


@announcement_routes.route('/get_Announcements_Teachers', methods=['GET'])
def get_announcements_teachers():
    teacher_id = request.args.get('Teacher_id')
    try:
        conn = get_connection()
        cursor = conn.cursor()
        query = '''
        SELECT Announcement, A.CourseID, AnnouncementID, C.Name, A.Timestamp
        FROM Announcement A
        JOIN Courses C ON A.CourseID = C.CourseID
        WHERE C.TeacherID = ?;
        '''
        cursor.execute(query, (teacher_id,))
        announcements = cursor.fetchall()
        announcements_list = [{'Announcement': row[0], 'CourseID': row[1], 'AnnouncementID': row[2], 'CourseName': row[3], 'Timestamp': row[4]} for row in announcements]
        return {'announcements': announcements_list, 'message': 'Announcements Successfully returned'}, 200
    
    except Exception as e:
        print("Error:", e)
        return {'error': str(e)}, 500
    
    finally:
        cursor.close()
        conn.close()
    

@announcement_routes.route('/get_Announcements_Students', methods=['GET'])
def get_announcements_students():
    student_id = request.args.get('student_id')
    try:
        conn = get_connection()
        cursor = conn.cursor()
        query = '''
        SELECT A.Announcement, C.CourseID, C.Name, A.Timestamp
        FROM Students S
        JOIN StudentGroup SG ON S.StudentID = SG.StudentID
        JOIN Groups G ON SG.GroupID = G.GroupID
        JOIN Courses C ON G.CourseID = C.CourseID
        JOIN Announcement A ON C.CourseID = A.CourseID
        WHERE S.StudentID = ?;
        '''
        cursor.execute(query, (student_id,))
        announcements = cursor.fetchall()
        announcements_list = [{'Announcement': row[0], 'CourseID': row[1], 'CourseName': row[2], 'Timestamp': row[3]} for row in announcements]
        return {'announcements': announcements_list, 'message': 'Announcements Successfully returned'}, 200
    
    except Exception as e:
        print("Error:", e)
        return {'error': str(e)}, 500
    
    finally:
        cursor.close()
        conn.close()


@announcement_routes.route('/Update_Announcement', methods=['PUT'])
def update_announcement():
    data = request.get_json()

    if not data or 'courseID' not in data or 'announcement' not in data or 'announcementID' not in data:
        return {'error': 'Missing required fields'}, 400
    
    course_id = data['courseID']
    announcement = data['announcement']
    announcement_id = data['announcementID']
    try:
        conn = get_connection()
        cursor = conn.cursor()
        query = '''
        UPDATE Announcement
        SET Announcement = ?, CourseID = ?
        WHERE AnnouncementID = ?;
        '''
        cursor.execute(query, (announcement, course_id, announcement_id))
        conn.commit()
        return {'message': 'Announcement Successfully updated'}, 200
    
    except Exception as e:
        print("Error:", e)
        return {'error': str(e)}, 500
    
    finally:
        cursor.close()
        conn.close()
