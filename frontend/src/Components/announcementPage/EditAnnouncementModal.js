import React, { useState, useEffect } from 'react';
import { Modal, Box, Button, TextField, Typography } from '@mui/material';
import axios from 'axios';

const EditAnnouncementModal = ({ show, onClose, announcement, onUpdate }) => {
  const [editedAnnouncement, setEditedAnnouncement] = useState('');
  const [courseID, setCourseID] = useState('');

  useEffect(() => {
    if (announcement) {
      setEditedAnnouncement(announcement.Announcement);
      setCourseID(announcement.CourseID);
    }
  }, [announcement]);

  const handleUpdate = async () => {
    if (!announcement) return;

    try {
      const response = await axios.put('http://localhost:5000/Update_Announcement', {
        courseID: courseID,
        announcement: editedAnnouncement,
        announcementID: announcement.AnnouncementID,
      });

      if (response.status === 200) {
        onUpdate({ ...announcement, Announcement: editedAnnouncement });
        onClose();
      }
    } catch (error) {
      console.error('Error updating announcement:', error);
    }
  };

  if (!announcement) return null;

  return (
    <Modal open={show} onClose={onClose}>
      <Box sx={{ padding: 3, backgroundColor: 'white', margin: 'auto', maxWidth: 400, marginTop: '15%' }}>
        <Typography variant="h6">Edit Announcement</Typography>
        <TextField
          label="Course ID"
          value={courseID}
          onChange={(e) => setCourseID(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Announcement"
          value={editedAnnouncement}
          onChange={(e) => setEditedAnnouncement(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
          <Button variant="contained" color="primary" onClick={handleUpdate}>
            Update
          </Button>
          <Button variant="outlined" color="secondary" onClick={onClose}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditAnnouncementModal;
