from flask import Blueprint, request, jsonify, redirect, url_for, session
from backend.db import conn
from dotenv import load_dotenv
import pyodbc

Announcement_Endpoints = Blueprint('Announcement_Endpoints', __name__)

@Announcement_Endpoints.route('/Create_Announcement', methods=['POST'])
def Create_Announcement():
    """
    Endpoint to create an announcement.

    Input:
        - JSON object containing:
            {
                "courseID": "CS101",        # Example course ID
                "announcement": "Exam on Friday"  # Example announcement text
            }

    Output:
        - Success: 
            {
                "message": "Announcement Successfully added"
            }, status code 200
        - Error:
            {
                "error": "error_message"  # Details of the error
            }, status code 500
    """
    data = request.get_json()
    Course_id = data['courseID']
    Announcement = data['announcement']
    try:
        cursor = conn.cursor()
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


@Announcement_Endpoints.route('/get_Announcements_Teachers', methods=['GET'])
def get_Announcements_Teachers():
    """
    Endpoint to retrieve announcements for a teacher.

    Input:
        - Session variable:
            {
                "Teacher_id": "T12345"  # Example teacher ID stored in the session
            }

    Output:
        - Success:
            {
                "announcements": [
                    {
                        "Announcement": "Assignment due next Monday",
                        "CourseID": "CS101",
                        "AnnouncementID": 1
                    },
                    {
                        "Announcement": "Midterm review session on Thursday",
                        "CourseID": "CS102",
                        "AnnouncementID": 2
                    }
                ],
                "message": "Announcements Successfully returned"
            }, status code 200
        - Error:
            {
                "error": "error_message"  # Details of the error
            }, status code 500
    """
    Teacher_id = session.get('Teacher_id')
    try:     
        cursor = conn.cursor()
        query = '''
        SELECT Announcement, A.CourseID, AnnouncementID
        FROM Announcement A 
        JOIN Courses C ON A.CourseID = C.CourseID
        WHERE C.TeacherID = ?;
        '''
        cursor.execute(query, (Teacher_id,))
        announcements = cursor.fetchall()
        announcements_list = [{'Announcement': row[0], 'CourseID': row[1], 'AnnouncementID': row[2]} for row in announcements]
        return {'announcements': announcements_list, 'message': 'Announcements Successfully returned'}, 200
    
    except Exception as e:
        print("Error:", e)
        return {'error': str(e)}, 500
    
    finally:
        cursor.close()
    

@Announcement_Endpoints.route('/get_Announcements_Students', methods=['GET'])
def get_Announcements_Students(): 
    """
    Endpoint to retrieve announcements for a student.

    Input:
        - Session variable:
            {
                "student_id": "S67890"  # Example student ID stored in the session
            }

    Output:
        - Success:
            {
                "announcements": [
                    "Final exam scheduled for December 10th",
                    "Project submission deadline extended to November 20th"
                ],
                "message": "Announcements Successfully returned"
            }, status code 200
        - Error:
            {
                "error": "error_message"  # Details of the error
            }, status code 500
    """
    Student_id = session.get('student_id')
    try:     
        cursor = conn.cursor()
        query = '''
        SELECT A.Announcement
        FROM Students S
        JOIN StudentGroup SG ON S.StudentID = SG.StudentID
        JOIN Groups G ON SG.GroupID = G.GroupID
        JOIN Courses C ON G.CourseID = C.CourseID
        JOIN Announcement A ON C.CourseID = A.CourseID
        WHERE S.StudentID = ?;
        '''
        cursor.execute(query, (Student_id,))
        announcements = cursor.fetchall()
        announcements_list = [row[0] for row in announcements]
        return {'announcements': announcements_list, 'message': 'Announcements Successfully returned'}, 200
    
    except Exception as e:
        print("Error:", e)
        return {'error': str(e)}, 500
    
    finally:
        cursor.close()


@Announcement_Endpoints.route('/Update_Announcement', methods=['PUT'])
def Update_Announcement():
    """
    Endpoint to update an announcement.

    Input:
        - JSON object containing:
            {
                "courseID": "CS101",                # Example course ID
                "announcement": "Updated exam date: next Friday",  # Updated announcement text
                "announcementID": 1                # ID of the announcement to update
            }

    Output:
        - Success:
            {
                "message": "Announcement Successfully updated"
            }, status code 200
        - Error:
            {
                "error": "error_message"  # Details of the error
            }, status code 500
    """
    data = request.get_json()
    Course_id = data['courseID']
    Announcement = data['announcement']
    AnnouncementID = data['announcementID']
    try:
        cursor = conn.cursor()
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
