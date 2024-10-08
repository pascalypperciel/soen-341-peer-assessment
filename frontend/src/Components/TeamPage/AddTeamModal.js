import React, { useState, useRef, useEffect } from 'react';
import Papa from 'papaparse';
import { Modal, TextField, Button, Box, Typography, FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText, OutlinedInput } from '@mui/material';
import axios from 'axios';
import '../../App.css';

function AddTeamModal({ onAddTeam, onClose }) {
  const [newTeam, setNewTeam] = useState({
    teamName: "",
    course: "",
    students: [],
  });
  const [availableCourses, setAvailableCourses] = useState([]);
  const [availableStudents, setAvailableStudents] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [createNewCourse, setCreateNewCourse] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchCoursesAndStudents = async () => {
      try {
        const coursesResponse = await axios.get('/getAllCourses');
        setAvailableCourses(coursesResponse.data);

        const studentsResponse = await axios.get('/getAllStudents');
        setAvailableStudents(studentsResponse.data);
      } catch (error) {
        console.error('Failed to fetch courses or students:', error);
      }
    };

    fetchCoursesAndStudents();
  }, []);

  const handleNewTeamChange = (e) => {
    const { name, value } = e.target;
    setNewTeam((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddTeam = () => {
    const newTeamData = { 
      ...newTeam, 
      course: createNewCourse ? newTeam.course : selectedCourse,
      students: selectedStudents 
    };
    onAddTeam(newTeamData);
    setNewTeam({ teamName: "", course: "", students: [] });
    setSelectedCourse('');
    setSelectedStudents([]);
    onClose();
  };

  const handleCsvUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          const csvTeams = result.data.map((team) => ({
            teamName: team.teamName || "Unnamed Team",  
            course: team.course || "No Course", 
            students: team.students
              ? team.students.split(",").map((s) => s.trim()) 
              : [], 
          }));
  
          csvTeams.forEach(onAddTeam);
        },
      });
    }
  };

  const handleFileButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleCourseSelection = (event) => {
    const value = event.target.value;
    if (value === "createNewCourse") {
      setCreateNewCourse(true);  
      setSelectedCourse('');
    } else {
      setSelectedCourse(value);
      setCreateNewCourse(false); 
    }
  };

  const handleStudentSelection = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedStudents(typeof value === 'string' ? value.split(',') : value);
  };

  const buttonStyle = {
    mt: 2,
    width: '100%',
    color: '#fff'
  };

  return (
    <Modal open={true} onClose={onClose}>
      <Box 
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" component="h2">Add New Team</Typography>

        <TextField
          fullWidth
          margin="normal"
          label="Team Name"
          name="teamName"
          value={newTeam.teamName}
          onChange={handleNewTeamChange}
        />

        <FormControl fullWidth margin="normal">
          <InputLabel id="select-course-label">Select Course</InputLabel>
          <Select
            labelId="select-course-label"
            value={selectedCourse || (createNewCourse ? "createNewCourse" : "")}
            label="Select Course"
            onChange={handleCourseSelection}
          >
            {availableCourses.map((course) => (
              <MenuItem key={course.courseId} value={course.courseId}>
                {course.name}
              </MenuItem>
            ))}
            <MenuItem value="createNewCourse">Create New Course</MenuItem>
          </Select>
        </FormControl>

        {createNewCourse && (
          <TextField
            fullWidth
            margin="normal"
            label="New Course Name"
            name="course"
            value={newTeam.course}
            onChange={handleNewTeamChange}
          />
        )}

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

        <Button 
          variant="contained" 
          sx={buttonStyle}
          onClick={handleAddTeam}
        >
          Add Team
        </Button>

        <Typography variant="h6" component="h3" sx={{ mt: 3 }}>Or Upload CSV</Typography>
        
        <Button
          variant="contained" 
          onClick={handleFileButtonClick}
          sx={buttonStyle} 
        >
          Upload CSV
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          style={{ display: 'none' }} 
          onChange={handleCsvUpload}
        />

        <Button 
          variant="contained" 
          color="error" 
          sx={buttonStyle}
          onClick={onClose}
        >
          Cancel
        </Button>
      </Box>
    </Modal>
  );
}

export default AddTeamModal;
