from flask import Blueprint,request,jsonify,redirect,url_for
from db import conn
from flask_cors import CORS
import pyodbc
from dotenv import load_dotenv
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

        cursor.commit()

    except Exception as e: 
        return {'error':str(e)},500 
    finally:
        cursor.close()  
    return jsonify({"message": "Teams successfully uploaded!"}), 200
