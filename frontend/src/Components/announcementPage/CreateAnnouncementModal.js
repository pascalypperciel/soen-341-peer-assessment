import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const CreateAnnouncementModal = ({ show, onClose, onCreate }) => {
  const [courseID, setCourseID] = useState('');
  const [announcement, setAnnouncement] = useState('');
  const [availableCourses, setAvailableCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const teacherId = localStorage.getItem("teacher_id");
        const response = await axios.get(`http://localhost:5000/getAllCourses?teacher_id=${teacherId}`);
        setAvailableCourses(response.data);
      } catch (error) {
        console.error('Failed to fetch courses:', error);
      }
    };

    fetchCourses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const selectedCourse = availableCourses.find(course => course.courseId === courseID);
      const courseName = selectedCourse ? selectedCourse.name : '';

      const response = await axios.post('http://localhost:5000/Create_Announcement', {
        courseID,
        announcement,
      });
      if (response.status === 200) {
        onCreate({ Announcement: announcement, CourseID: courseID, CourseName: courseName });
        setCourseID('');
        setAnnouncement('');
        onClose();
      }
    } catch (error) {
      console.error('Error creating announcement:', error);
    }
  };

  return (
    <Dialog open={show} onClose={onClose}>
      <DialogTitle>Create Announcement</DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="normal">
          <InputLabel id="course-select-label">Select Course</InputLabel>
          <Select
            labelId="course-select-label"
            value={courseID}
            onChange={(e) => setCourseID(e.target.value)}
            label="Select Course"
          >
            {availableCourses.map((course) => (
              <MenuItem key={course.courseId} value={course.courseId}>
                {course.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Announcement"
          fullWidth
          margin="dense"
          multiline
          rows={4}
          value={announcement}
          onChange={(e) => setAnnouncement(e.target.value)}
          required
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateAnnouncementModal;
