import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Box, Stack, Alert } from '@mui/material';
import axios from 'axios';

function TeamCard({ team, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTeam, setEditedTeam] = useState({ ...team });
  const [isTeacher, setIsTeacher] = useState(false);
	const [tempStudentIds, setTempStudentIds] = useState(editedTeam.students.map((s) => s.studentId).join(", "));
	const [error, setError] = useState(null);

  useEffect(() => {
    const teacherId = localStorage.getItem("teacher_id");
    if (teacherId) {
      setIsTeacher(true);
    }
  }, []);

  const handleEdit = async () => {
		const studentIdsArray = tempStudentIds.split(",").map(id => id.trim());
		const updatedStudents = studentIdsArray.map((id, index) => ({
			studentId: id,
			name: editedTeam.students[index]?.name || "",
		}));

		const updatedData = {
			team_id: editedTeam.groupId,
			course_id: editedTeam.courseId,
			team_name: editedTeam.groupName,
			course_name: editedTeam.courseName,
			student_ids: studentIdsArray
		};

		try {
			const response = await axios.put('/editTeam', updatedData);

			if (response.status === 200) {
				setEditedTeam({
					...editedTeam,
					students: updatedStudents
				});
				setError(null);
				onEdit(editedTeam);
				setIsEditing(false);
			} else {
				setError("Failed to edit the team");
			}
		} catch (error) {
			if (error.response && error.response.data && error.response.data.error) {
				setError(error.response.data.error);
			} else {
				setError("An unknown error occurred. Please try again.");
			}
		}
  };

	const toggleEdit = () => {
    setIsEditing((prevIsEditing) => !prevIsEditing);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedTeam((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

	const handleStudentIdsChange = (e) => {
		const studentIds = e.target.value; 
		setTempStudentIds(studentIds);
	};	

  const handleDelete = async () => {
    try {
      const response = await axios.post('/deleteTeam', { team_id: team.groupId });
      if (response.status === 200) {
        onDelete(team.groupId);
      } else {
        console.error('Failed to delete the team:', response.data);
      }
    } catch (error) {
      console.error('Error deleting team:', error);
    }
  };

  return (
    <Box
      className="team-card"
      sx={{
        backgroundColor: '#f1f1f1',
        padding: 2,
        borderRadius: 2,
        boxShadow: 2,
        width: '300px',
        marginBottom: 3,
        margin: '10px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
      }}
    >
      {isEditing ? (
        <>
          <TextField
            fullWidth
            margin="normal"
            label="Group Name"
            name="groupName"
            value={editedTeam.groupName}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Course Name"
            name="courseName"
            value={editedTeam.courseName}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Student IDs"
            name="students"
            placeholder="Enter student IDs, separated by commas"
						value={tempStudentIds}
						onChange={handleStudentIdsChange}
          />
					{error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </>
      ) : (
        <>
          <Typography variant="h6" gutterBottom>
            {team.groupName}
          </Typography>
					<Stack spacing={2}>
						<Stack direction="row" spacing={1}>
							<Typography variant="body2" sx={{ fontWeight: 'bold' }}>
									Course:
							</Typography>
							<Typography variant="body2" sx={{ mb: 2 }}>
									{team.courseName}
							</Typography>
						</Stack>

						<Stack direction="row" spacing={1}>
							<Typography variant="body2" sx={{ fontWeight: 'bold' }}>
								Students:
							</Typography>
							<Typography variant="body2">
								{team.students.map((student, index) => (
									<span key={index}>
										{student.name} (ID: {student.studentId})
										{index < team.students.length - 1 && <br />}
									</span>
								))}
							</Typography>
						</Stack>
					</Stack>
        </>
      )}
      {isTeacher && (
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
          <Button
            variant="contained"
            color={isEditing ? 'success' : 'primary'}
            onClick={isEditing ? handleEdit : toggleEdit}
          >
            {isEditing ? "Save" : "Edit"}
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDelete}
          >
            Delete
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default TeamCard;
