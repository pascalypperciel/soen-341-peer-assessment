from flask import Blueprint,request,jsonify,redirect,url_for,session,render_template
from backend.db import conn
from dotenv import load_dotenv

ratings_routes = Blueprint('ratings_routes', __name__)


#this route retrieves all groups the student is in, returns the groups
#and their attributes as a JSON list such that front end can display
#in the format they desire

@ratings_routes.route('/getStudentGroups',  methods=['GET'])
def get_Student_Groups():
    # Get the student ID from the session
    student_id = session.get('student_id')

    if not student_id:
        return jsonify({"error": "Student not logged in!"}), 401

    try:
        cursor = conn.cursor()

        # Query for groups the student is a part of
        query = """
            SELECT Groups.GroupID, Groups.Name AS GroupName, Groups.CourseID, Courses.Name AS CourseName
            FROM StudentGroup
            JOIN Groups ON Groups.GroupID = StudentGroup.GroupID
            JOIN Courses ON Courses.CourseID = Groups.CourseID
            WHERE StudentGroup.StudentID = ?
        """
        cursor.execute(query, (student_id,))

        groups_result = cursor.fetchall()

        # If no groups, return a message
        if not groups_result:
            return jsonify({"message": f"No groups for this student!"}), 404

        # Convert the query result into a list of dictionaries
        groups_list = [
            {
                "GroupID": group[0],
                "GroupName": group[1],
                "CourseID": group[2],
                "CourseName": group[3]
            }
            for group in groups_result
        ]

        # Return the list of groups as a JSON object, can be manipulated as needed by front end 
        return jsonify(groups_list), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500



# this route gets the unrated students based the group the end user 
# chose from the front end. assumed the group_id is passed into url
# 
# searches for that group and verifies all students inside without a
# rating by the user 
@ratings_routes.route('/getStudentRatees/<int:group_id>', methods= ['GET'])
def get_student_ratees(group_id):

    student_id = session.get('student_id')

     
    if not group_id:
        return jsonify({"error": "Student not logged in!"}), 401

    try:
        cursor = conn.cursor()

        query = """
       SELECT s.StudentID, s.Name
        FROM Students s
        JOIN StudentGroup sg ON s.StudentID = sg.StudentID
        LEFT JOIN Ratings r ON s.StudentID = r.RateeID AND r.RaterID = ? AND r.GroupID = sg.GroupID
        WHERE sg.GroupID = ?
        AND s.StudentID <> ?
        AND r.RateeID IS NULL;

    """
        cursor.execute(query, (student_id,group_id,student_id))
        students = cursor.fetchall()
   
        #close after fetch
        conn.close()

        # Return the results as a JSON response using jsonify, return all eligible students to be rated 
        return jsonify({'students': [{'StudentID': student.StudentID, 'Name': student.Name} for student in students]})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


#get the JSON obj from front end with all metrics to be inserted, unwrap 
#and insert into db 
@ratings_routes.route('/InsertStudRatings', methods= ['POST'])
def insert_Stud_Ratings():

    rater_id = session.get('student_id')

    #obtaining infromation from the signup form
    data= request.get_json()
    ratee_id=data['ratee_id']
    group_id=data['group_id']
    cooperation_rating = data['cooperation_rating']
    conceptual_contribution_rating = data['conceptual_contribution_rating']
    practical_contribution_rating = data['practical_contribution_rating']
    work_ethic_rating = data['work_ethic_rating']

    # SQL query to insert the ratings into the database
    query = """
        INSERT INTO Ratings (CooperationRating, ConceptualContributionRating, PracticalContributionRating, WorkEthicRating, RaterID, RateeID, GroupID)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """

    # Execute the query with the provided data
    cursor = conn.cursor()
    cursor.execute(query, (
        cooperation_rating,
        conceptual_contribution_rating,
        practical_contribution_rating,
        work_ethic_rating,
        rater_id,
        ratee_id,
        group_id
    ))
    conn.commit()
    cursor.close()

    return jsonify({"message": "Rating successfully inserted."}), 201