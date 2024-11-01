from flask import Blueprint,request,jsonify,redirect,url_for,session
from backend.db import conn
from dotenv import load_dotenv
import pyodbc

#imports for the csv reading
from io import StringIO
import csv

teams_page_routes = Blueprint('teams_page_routes', __name__)

@teams_page_routes.route('/makeTeamsManually', methods= ['POST'])
def make_team_manually():
	data = request.get_json()

	team_name = data.get('team_name')
	course_name = data.get('course_name')
	student_ids = data.get('student_ids')
	teacher_id = data.get('teacher_id')
	
	#if no students return error 
	if not student_ids:
		return jsonify({"error": "No student IDs provided"}), 400

	try:
		cursor = conn.cursor()

		# Course
		course_id = 0
		check_course_query = """
		SELECT CourseID FROM Courses WHERE Name = ?
		"""
		cursor.execute(check_course_query, (course_name,))
		result = cursor.fetchone()
		if not result:		
			insert_course_query = """
			INSERT INTO Courses (Name, TeacherID)
			VALUES (?, ?);
			"""
			cursor.execute(insert_course_query, (course_name, teacher_id))
			conn.commit()
			cursor.execute(check_course_query, (course_name,))
			result = cursor.fetchone()
			course_id = result[0]
		else:
			course_id = result[0]

		# Group
		insert_group_query = """
			INSERT INTO Groups (Name, CourseID)
			VALUES (?, ?);
			"""
		cursor.execute(insert_group_query, (team_name, course_id))
		check_group_query = """
			SELECT GroupID FROM Groups WHERE Name = ?
			"""
		cursor.execute(check_group_query, (team_name,))
		result = cursor.fetchone()
		group_id = result[0]

		# StudentGroup
		insert_student_group_query = """
		INSERT INTO StudentGroup (GroupID, StudentID)
		VALUES (?, ?)
		"""
		for student_id in student_ids:
			cursor.execute(insert_student_group_query, (group_id,student_id))

		conn.commit()

	except Exception as e :
		conn.rollback()
		return {'error': str(e)}, 500
 
	finally:
		cursor.close()

	return {'message': 'Inserts successful'}, 200

@teams_page_routes.route('/makeTeamCSV', methods=['POST'])
def make_team_CSV():
    file = request.files['file']
    teacher_id = request.form.get('teacher_id')

    if not file or not teacher_id:
        return jsonify({"error": "Missing required data: file or teacher_id"}), 400

    file_stream = StringIO(file.read().decode("utf-8"))
    csv_reader = csv.reader(file_stream)
    
    teams = [] 
    current_team = []
    group_names = []
    course_names = [] 
    courses_cache = {}

    try:
        cursor = conn.cursor()

        for row in csv_reader:
            if not row:
                continue
            try:
                student_id = int(row[0].strip())
                team_name = row[1].strip() if len(row) > 1 else "Unnamed Team"
                course_name = row[2].strip() if len(row) > 2 else "Unnamed Course"
                
                if team_name not in group_names:
                    group_names.append(team_name)
                    current_team = []
                    teams.append((team_name, course_name, current_team))
                
                current_team.append(student_id)
            except ValueError:
                return jsonify({"error": "Invalid student ID format in file"}), 400

        for team_name, course_name, team_students in teams:
            # check if the course exists, create if not
            if course_name not in courses_cache:
                check_course_query = "SELECT CourseID FROM Courses WHERE Name = ?"
                cursor.execute(check_course_query, (course_name,))
                result = cursor.fetchone()

                if result:
                    course_id = result[0]
                else:
                    insert_course_query = "INSERT INTO Courses (Name, TeacherID) VALUES (?, ?)"
                    cursor.execute(insert_course_query, (course_name, teacher_id))
                    conn.commit()

                    cursor.execute(check_course_query, (course_name,))
                    course_id = cursor.fetchone()[0]

                courses_cache[course_name] = course_id
            else:
                course_id = courses_cache[course_name]

            insert_group_query = "INSERT INTO Groups (Name, CourseID) VALUES (?, ?)"
            cursor.execute(insert_group_query, (team_name, course_id))
            conn.commit()

            cursor.execute("SELECT GroupID FROM Groups WHERE Name = ?", (team_name,))
            group_id = cursor.fetchone()[0]

            insert_student_group_query = "INSERT INTO StudentGroup (GroupID, StudentID) VALUES (?, ?)"
            for student_id in team_students:
                cursor.execute(insert_student_group_query, (group_id, student_id))

        conn.commit()

    except Exception as e:
        conn.rollback()
        return {'error': str(e)}, 500

    finally:
        cursor.close()

    return jsonify({"message": "Teams successfully uploaded!"}), 200


@teams_page_routes.route('/displayTeamsTeacher',methods=['GET'])
def display_teams_teacher():
	teacher_id = request.args.get('teacher_id')

	try:
		cursor = conn.cursor()
		# find groups with matching TeacherIDs
		grous_query="""
		SELECT Groups.GroupID, Groups.Name, Groups.CourseID, Courses.Name
		FROM Groups 
		JOIN Courses ON Courses.CourseID = Groups.CourseID
		WHERE Courses.TeacherID = ?
		"""
		cursor.execute(grous_query,teacher_id)

		#fetch all rows from the response to extract the groupids with the respective courseid
		groups_result=cursor.fetchall()

		if not groups_result:
			return jsonify({"message": "No groups found for this course"}), 404
		
		# Preparing list to return 
		groups_in_course = []

		#find the students with a certain group matching the course id
		for group in groups_result:
			group_id = group[0]  # GroupID
			group_name = group[1]  # GroupName
			course_id = group[2] # CourseID
			course_name = group[3] # CourseName

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

			groups_in_course.append({
					"groupId": group_id,
					"groupName": group_name,
					"courseId": course_id,
					"courseName": course_name,
					"students": students_in_group
				})

		#return nested list of the groups within a course
		return jsonify(groups_in_course), 200
		 
	except Exception as e :
		return {'error': str(e)}, 500
	
	finally: 
		cursor.close()
	
# csv format is assumed to be studentID in each row, when there is an empty row, signaling of end of that specific team 
@teams_page_routes.route('/displayTeamsStudent',methods=['GET'])
def display_teams_student ():
	student_id = request.args.get('student_id')

	try:
		cursor = conn.cursor()

		#query for groups the student is apart of
		query = """
			SELECT Groups.GroupID, Groups.Name, Groups.CourseID, Courses.Name
			FROM StudentGroup
			JOIN Groups ON Groups.GroupID = StudentGroup.GroupID
			JOIN Courses on Courses.CourseID = Groups.CourseID
			WHERE StudentGroup.StudentID = ?
		"""
		cursor.execute(query, (student_id,))

		groups_result = cursor.fetchall()

		#if no groups return message 
		if not groups_result:
			return jsonify({"message": f"No groups for this student!"}), 404
		
		#In each group find the other team members
		groups_with_students = []

		for group in groups_result:
			group_id = group[0]  # GroupID
			group_name = group[1]  # GroupName
			course_id = group[2]  # CourseID
			course_name = group[3]  # CourseName

			# Query to get all students in this group
			students_query = """
				SELECT Students.StudentID, Students.Name
				FROM Students
				JOIN StudentGroup ON Students.StudentID = StudentGroup.StudentID
				WHERE StudentGroup.GroupID = ?
			"""
			cursor.execute(students_query, (group_id,))
			students_result = cursor.fetchall()

			students_in_group = [{"studentId": student[0], "name": student[1]} for student in students_result]

			# Append the group to the list of groups
			groups_with_students.append({
				"groupId": group_id,
				"groupName": group_name,
				"courseId": course_id,
				"courseName": course_name,
				"students": students_in_group
			})

		return jsonify(groups_with_students), 200

	except pyodbc.Error as e:
		return jsonify({"error": f"Database error: {str(e)}"}), 500

	finally:
		cursor.close()

@teams_page_routes.route('/deleteTeam',methods=['POST'])
def delete_team():
	data= request.get_json()
	team_id = data['team_id']

	try: 
		cursor = conn.cursor()

		delete_studentgroup_query = "DELETE FROM StudentGroup WHERE GroupID = ?"
		cursor.execute(delete_studentgroup_query, (team_id,))

		delete_groups_query = "DELETE FROM Groups WHERE GroupID = ?"
		cursor.execute(delete_groups_query, (team_id,))

		conn.commit()
				
	except Exception as e :
		conn.rollback()
		return {'error': str(e)}, 500
	
	finally:
		cursor.close()
	
	return {'message': 'Delete successful'}, 200

@teams_page_routes.route('/editTeam',methods=['PUT'])
def edit_team():
	data = request.get_json()

	team_id = data.get('team_id')
	course_id = data.get('course_id')
	new_team_name = data.get('team_name')
	new_course_name = data.get('course_name')
	new_student_ids = data.get('student_ids')

	if not team_id or not new_team_name or not new_course_name or not new_student_ids:
		return {'error': 'Missing required fields'}, 400

	try: 
		cursor = conn.cursor()
		
		# check if the student ids exist
		missing_students = []
		check_student_id_query = """
		SELECT StudentID 
		FROM Students 
		WHERE StudentID = ?
		"""
		for student_id in new_student_ids:
			cursor.execute(check_student_id_query, (student_id,))
			result = cursor.fetchone()
			if not result:		
				missing_students.append(student_id)

		if missing_students:
			return {'error': f'Student IDs not found: {", ".join(missing_students)}'}, 400
			
		# updates
		update_group_query = """
		UPDATE Groups
		SET Name = ?
		WHERE GroupID = ?
		"""
		update_course_query = """
		UPDATE Courses
		SET Name = ?
		WHERE CourseID = ?
		"""
		cursor.execute(update_group_query, (new_team_name, team_id))
		cursor.execute(update_course_query, (new_course_name, course_id))

		# delete
		delete_student_group_query = """
		DELETE FROM StudentGroup WHERE GroupID = ?
		"""
		cursor.execute(delete_student_group_query, (team_id,))
		
		# insert
		insert_student_group_query = """
		INSERT INTO StudentGroup (GroupID, StudentID)
		VALUES (?, ?)
		"""
		for student_id in new_student_ids:
			cursor.execute(insert_student_group_query, (team_id, student_id))

		conn.commit()
				
	except Exception as e :
		conn.rollback()
		return {'error': str(e)}, 500
	
	finally:
		cursor.close()
	
	return {'message': 'Edit successful'}, 200

@teams_page_routes.route('/getAllStudents', methods=['GET'])
def get_all_students():
	try: 
		cursor = conn.cursor()

		query = """SELECT StudentID, Name FROM Students"""
		cursor.execute(query)
		students_result = cursor.fetchall()

		if students_result:
			students_array = []
			
			for student in students_result:
				student_id = student[0]  # ID
				student_name = student[1]  # Name

				students_array.append({
					"studentId": student_id,
					"name": student_name
				})

			return jsonify(students_array), 200
		else:
			return {'message': 'No students found'}, 401

	except Exception as e:
		return {'error': str(e)}, 500

	finally:
		cursor.close()

@teams_page_routes.route('/getGroupedStudents', methods=['GET'])
def get_grouped_students():
	course_id = request.args.get('course_id')

	try: 
		cursor = conn.cursor()

		query = """
		SELECT DISTINCT StudentGroup.StudentID
		FROM StudentGroup
		LEFT JOIN Groups ON Groups.GroupID = StudentGroup.GroupID
		LEFT JOIN Courses ON Courses.CourseID = Groups.CourseID
		WHERE Courses.CourseID = ?
		"""
		cursor.execute(query, (course_id,))
		students_result = cursor.fetchall()

		if students_result:
			students_array = [{"studentId": student[0]} for student in students_result]
			return jsonify(students_array), 200
		else:
			return jsonify([]), 200

	except Exception as e:
		return {'error': str(e)}, 500

	finally:
		cursor.close()

@teams_page_routes.route('/getAllCourses', methods=['GET'])
def get_all_courses():
	teacher_id = request.args.get('teacher_id')

	try: 
		cursor = conn.cursor()

		query = """SELECT CourseID, Name FROM Courses WHERE TeacherID = ?"""
		cursor.execute(query, (teacher_id,))
		courses_result = cursor.fetchall()

		if courses_result:
			courses_array = []
			
			for course in courses_result:
				course_id = course[0]  # ID
				course_name = course[1]  # Name

				courses_array.append({
					"courseId": course_id,
					"name": course_name
				})

			return jsonify(courses_array), 200
		else:
			return {'message': 'No courses found'}, 401

	except Exception as e:
		return {'error': str(e)}, 500

	finally:
		cursor.close()