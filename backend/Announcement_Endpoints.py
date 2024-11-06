from flask import Blueprint,request,jsonify,redirect,url_for,session
from backend.db import conn
from dotenv import load_dotenv
import pyodbc

Announcement_Endpoints= Blueprint('Announcement_Endpoints', __name__)

@Announcement_Endpoints.route('/Create_Announcement', methods=['POST'])
def Create_Announcement():
    data= request.get_json()
#Obtain info from request
    Course_id=data['courseID']
    Announcement=data['announcement']
    try:
        cursor= conn.cursor()
        
        #query to add announcement to announcement db with respective courseID
        query='''
        INSERT INTO Announcement (Announcement, CourseID)
        VALUES(?,?)
        '''
        cursor.execute(query,(Announcement,Course_id))
        conn.commit()
        return {'message': 'Announcement Succesfully added'}, 200
    
    except Exception as e :
        print("Error:", e)
        return {'error': str(e)}, 500
    
    finally:
        cursor.close()


@Announcement_Endpoints.route('/get_Announcements_Teachers', methods=['GET'])
def get_Announcements_Teachers():
    Teacher_id=session['Teacher_id']
    try:     
        cursor= conn.cursor()
        #query to retrive announcements with respective teacherID from courses
        query='''
        SELECT Announcement, CourseID, AnnouncementID
        FROM Announcement A 
        JOIN Courses C ON A.CourseID = C.CourseID
        WHERE C.TeacherID=(?)
        '''
        cursor.execute(query,(Teacher_id,))
        announcements=cursor.fetchall()
        announcements_list=[{'Announcement': row[0], 'CourseID': row[1], 'AnnouncementID': row[2]} for row in announcements]
        return {'announcements': announcements_list,'message': 'Announcements Succesfully returned '}, 200
    
    except Exception as e :
        print("Error:", e)
        return {'error': str(e)}, 500
    finally:
        cursor.close()
    
@Announcement_Endpoints.route('/get_Announcements_Students', methods=['GET'])
def get_Announcements_Students(): 
    Student_id=session['student_id']
    try:     
        cursor= conn.cursor()
        #query to obtain all announcements for students with matching student id by joining 
        #student groups, groups,courses and students
        
        query='''
        SELECT A.Announcement
        FROM Students S
        JOIN StudentGroup SG ON S.StudentID = SG.StudentID
        JOIN Groups G ON SG.GroupID = G.GroupID
        JOIN Courses C ON G.CourseID = C.CourseID
        JOIN Announcement A ON C.CourseID = A.CourseID
        WHERE S.StudentID = ?;
        '''
        cursor.execute(query,(Student_id,))
        announcements=cursor.fetchall()
        announcements_list=[row[0] for row in announcements]
        return {'announcements': announcements_list,'message': 'Announcements Succesfully returned '}, 200
    
    except Exception as e :
        print("Error:", e)
        return {'error': str(e)}, 500
    finally:
        cursor.close()
    
@Announcement_Endpoints.route('/Update_Announcement', methods=['PUT'])
def Update_Announcement():
    data= request.get_json()
    #Obtain info from request
    Course_id=data['courseID']
    Announcement=data['announcement']
    AnnouncementID=data['announcementID']
    try:
        cursor= conn.cursor()
        
        #query to update announcement with respective announcementid
        query='''
        UPDATE Announcement
        SET Announcement = ?, CourseID = ?
        WHERE AnnouncementID = ?;
        '''
        cursor.execute(query,(Announcement,Course_id,AnnouncementID))
        conn.commit()
        return {'message': 'Announcement Succesfully updated'}, 200
    
    except Exception as e :
        print("Error:", e)
        return {'error': str(e)}, 500
    
    finally:
        cursor.close()