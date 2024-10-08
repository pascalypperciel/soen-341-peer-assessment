import React, { useState, useRef } from 'react';
import Papa from 'papaparse';
import { Modal, TextField, Button, Box, Typography } from '@mui/material';
import '../../App.css';

function AddTeamModal({ onAddTeam, onClose }) {
  const [newTeam, setNewTeam] = useState({
    teamName: "",
    course: "",
    students: "",
  });

  const fileInputRef = useRef(null);

  const handleNewTeamChange = (e) => {
    const { name, value } = e.target;
    setNewTeam((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddTeam = () => {
    const studentsArray = newTeam.students.split(",").map((s) => s.trim());
    const newTeamData = { ...newTeam, students: studentsArray };
    onAddTeam(newTeamData);
    setNewTeam({ teamName: "", course: "", students: "" });
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
        <TextField
          fullWidth
          margin="normal"
          label="Course"
          name="course"
          value={newTeam.course}
          onChange={handleNewTeamChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Students"
          name="students"
          placeholder="Enter students, separated by commas"
          value={newTeam.students}
          onChange={handleNewTeamChange}
        />
        
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
