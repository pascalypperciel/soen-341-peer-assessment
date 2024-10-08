import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Box, Stack } from '@mui/material';
import axios from 'axios';

function TeamCard({ team, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTeam, setEditedTeam] = useState({ ...team });
  const [studentsInput, setStudentsInput] = useState("");
  const [isTeacher, setIsTeacher] = useState(false);

  useEffect(() => {
    const teacherId = localStorage.getItem("teacher_id");
    if (teacherId) {
      setIsTeacher(true);
    }
    setStudentsInput(editedTeam.students.map((s) => s.name).join(", "));
  }, [editedTeam]);

  const handleEdit = () => {
    if (isEditing) {
        const updatedStudents = studentsInput.split(",").map((s) => ({ name: s.trim() }));
        onEdit({ ...editedTeam, students: updatedStudents });
    }
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedTeam((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStudentsChange = (e) => {
    setStudentsInput(e.target.value);
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
            label="Students"
            name="students"
            placeholder="Enter students, separated by commas"
            value={studentsInput}
            onChange={handleStudentsChange}
          />
        </>
      ) : (
        <>
          <Typography variant="h6" gutterBottom>
            {team.groupName}
          </Typography>
          <Stack direction="row" spacing={1}>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                Course:
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
                {team.courseName}
            </Typography>
          </Stack>

          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
            Students:
          </Typography>
          <Typography variant="body2">
            <ul style={{ paddingLeft: '20px', margin: '0' }}>
              {team.students.map((student, index) => (
                <li key={index}>{student.name}</li>
              ))}
            </ul>
          </Typography>
        </>
      )}
      {isTeacher && (
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
            <Button
							variant="contained"
							color={isEditing ? 'success' : 'primary'}
							onClick={handleEdit}
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
