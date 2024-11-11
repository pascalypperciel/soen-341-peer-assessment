import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Box, Stack, Alert, Checkbox, MenuItem, Select, FormControl, InputLabel, OutlinedInput, ListItemText } from '@mui/material';
import axios from 'axios';

function TeamCard({ team, teams, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTeam, setEditedTeam] = useState({ ...team });
  const [isTeacher, setIsTeacher] = useState(false);
  const [availableStudents, setAvailableStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const teacherId = localStorage.getItem("teacher_id");
    if (teacherId) {
      setIsTeacher(true);
    }
  }, []);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const allStudentsResponse = await axios.get('http://localhost:5000/getAllStudents');
        const allStudents = allStudentsResponse.data;

        const groupedStudentsResponse = await axios.get(`http://localhost:5000/getGroupedStudents?course_id=${editedTeam.courseId}`);
        const groupedStudents = groupedStudentsResponse.data;

        const filteredStudents = allStudents.filter(student => 
          !groupedStudents.some(groupedStudent => 
            groupedStudent.studentId === student.studentId
          ) || editedTeam.students.some(member => member.studentId === student.studentId)
        );

        setAvailableStudents(filteredStudents);
      } catch (error) {
        console.error('Failed to fetch students:', error);
      }
    };

    if (isEditing) {
      fetchStudents();
      setSelectedStudents(editedTeam.students.map((s) => s.studentId));
    }
  }, [editedTeam.courseId, editedTeam.students, isEditing]);

  const handleEdit = async () => {
    const updatedData = {
      team_id: editedTeam.groupId,
      course_id: editedTeam.courseId,
      team_name: editedTeam.groupName,
      course_name: editedTeam.courseName,
      student_ids: selectedStudents
    };

    try {
      const response = await axios.put('http://localhost:5000/editTeam', updatedData);

      if (response.status === 200) {
        setEditedTeam({
          ...editedTeam,
          students: availableStudents.filter((student) => selectedStudents.includes(student.studentId))
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

  const handleCancelEdit = () => {
    // Reset to the original team data and exit edit mode
    setEditedTeam({ ...team });
    setSelectedStudents(team.students.map((s) => s.studentId));
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedTeam((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStudentSelection = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedStudents(typeof value === 'string' ? value.split(',') : value);
  };

  const handleDelete = async () => {
    try {
      const response = await axios.post('http://localhost:5000/deleteTeam', { team_id: team.groupId });
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
          <Typography variant="body1" sx={{ mt: 2, mb: 1 }}>
            Select Students:
          </Typography>

          {/* Dropdown for student selection */}
          <FormControl fullWidth margin="normal">
            <InputLabel id="select-students-label">Select Students</InputLabel>
            <Select
              labelId="select-students-label"
              multiple
              value={selectedStudents}
              onChange={handleStudentSelection}
              input={<OutlinedInput label="Select Students" />}
              renderValue={(selected) =>
                availableStudents
                  .filter((student) => selected.includes(student.studentId))
                  .map((student) => `${student.name} (ID: ${student.studentId})`)
                  .join(', ')
              }
            >
              {availableStudents.map((student) => (
                <MenuItem key={student.studentId} value={student.studentId}>
                  <Checkbox checked={selectedStudents.includes(student.studentId)} />
                  <ListItemText primary={`${student.name} (ID: ${student.studentId})`} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

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
            color={isEditing ? 'warning' : 'error'}
            onClick={isEditing ? handleCancelEdit : handleDelete}
          >
            {isEditing ? "Cancel" : "Delete"}
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default TeamCard;
