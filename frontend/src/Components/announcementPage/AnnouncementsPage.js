import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Box, Button, Typography, List, ListItem, ListItemText, Paper } from '@mui/material';
import CreateAnnouncementModal from './CreateAnnouncementModal';

const AnnouncementsPage = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [userRole, setUserRole] = useState("");

  const fetchAnnouncements = useCallback(async () => {
    try {
      const endpoint = userRole === 'teacher' ? '/api/get_Announcements_Teachers' : '/api/get_Announcements_Students';
      const response = await axios.get(endpoint);
      if (response.data && response.data.announcements) {
        setAnnouncements(response.data.announcements);
      }
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
  }, [userRole]);

  useEffect(() => {
    const studentId = localStorage.getItem("student_id");
    const teacherId = localStorage.getItem("teacher_id");

    if (teacherId) {
      setUserRole('teacher');
    } else if (studentId) {
      setUserRole('student');
    }
  }, []);

  useEffect(() => {
    if (userRole) {
      fetchAnnouncements();
    }
  }, [userRole, fetchAnnouncements]);

  const handleCreateAnnouncement = (newAnnouncement) => {
    setAnnouncements((prevAnnouncements) => [...prevAnnouncements, newAnnouncement]);
  };

  return (
    <Box sx={{ padding: 3, maxWidth: 600, margin: '0 auto' }}>
      <Typography variant="h4" align="center" gutterBottom>
        Announcements
      </Typography>
      {userRole === 'teacher' ? (
        <>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => setShowModal(true)} 
            sx={{ marginBottom: 2 }}
          >
            Create Announcement
          </Button>
          <CreateAnnouncementModal
            show={showModal}
            onClose={() => setShowModal(false)}
            onCreate={handleCreateAnnouncement}
          />
        </>
      ) : ( <div></div>
      )}

      <Paper elevation={3} sx={{ padding: 2, marginTop: 2 }}>
        <List>
          {announcements.length > 0 ? (
            announcements.map((announcement, index) => (
              <ListItem key={index} divider>
                <ListItemText primary={announcement.Announcement || announcement} />
              </ListItem>
            ))
          ) : (
            <Typography variant="body1" color="textSecondary" align="center">
              No announcements available.
            </Typography>
          )}
        </List>
      </Paper>
    </Box>
  );
};

export default AnnouncementsPage;
