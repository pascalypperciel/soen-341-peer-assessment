import React, { useState } from 'react';
import axios from 'axios';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';

const CreateAnnouncementModal = ({ show, onClose, onCreate }) => {
  const [courseID, setCourseID] = useState('');
  const [announcement, setAnnouncement] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/Create_Announcement', {
        courseID,
        announcement,
      });
      if (response.status === 200) {
        onCreate({ Announcement: announcement, CourseID: courseID });
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
        <TextField
          label="Course ID"
          fullWidth
          margin="dense"
          value={courseID}
          onChange={(e) => setCourseID(e.target.value)}
          required
        />
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
