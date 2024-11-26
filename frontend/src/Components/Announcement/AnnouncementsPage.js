import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Box, Button, Typography, List, ListItem, ListItemText, Paper, Divider } from '@mui/material';
import CreateAnnouncementModal from './CreateAnnouncementModal';
import EditAnnouncementModal from './EditAnnouncementModal';
import Header from "../Header/Header";

const AnnouncementsPage = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  const fetchAnnouncements = useCallback(async () => {
    try {
      const id = userRole === 'teacher' ? localStorage.getItem("teacher_id") : localStorage.getItem("student_id");
      const endpoint = userRole === 'teacher' 
        ? `http://localhost:5000/get_Announcements_Teachers?Teacher_id=${id}`
        : `http://localhost:5000/get_Announcements_Students?student_id=${id}`;

      const response = await axios.get(endpoint);
      if (response.data && response.data.announcements) {
        const sortedAnnouncements = response.data.announcements.sort(
          (a, b) => new Date(b.Timestamp) - new Date(a.Timestamp)
        );
        setAnnouncements(sortedAnnouncements);
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

  const handleEditClick = (announcement) => {
    setSelectedAnnouncement(announcement);
    setEditModalOpen(true);
  };

  const handleUpdateAnnouncement = (updatedAnnouncement) => {
    setAnnouncements((prevAnnouncements) =>
      prevAnnouncements.map((ann) =>
        ann.AnnouncementID === updatedAnnouncement.AnnouncementID ? updatedAnnouncement : ann
      )
    );
  };

  const groupedAnnouncements = announcements.reduce((acc, announcement) => {
    const courseName = announcement.CourseName || "Unknown Course";
    if (!acc[courseName]) {
      acc[courseName] = [];
    }
    acc[courseName].push(announcement);
    return acc;
  }, {});

  return (
    <div>
      <Header />
      <Box sx={{ padding: 3, maxWidth: 600, margin: '0 auto' }}>
        <Typography variant="h4" align="center" gutterBottom>
          Announcements
        </Typography>
        {userRole === 'teacher' ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 2 }}>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => setShowModal(true)}
            >
              Create Announcement
            </Button>
          </Box>
        ) : null}
      
        <CreateAnnouncementModal
          show={showModal}
          onClose={() => {
            setShowModal(false);
            window.location.reload();
          }}
          onCreate={handleCreateAnnouncement}
        />

        <EditAnnouncementModal
          show={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          announcement={selectedAnnouncement}
          onUpdate={handleUpdateAnnouncement}
        />

        <Paper elevation={3} sx={{ padding: 2, marginTop: 2 }}>
          {Object.keys(groupedAnnouncements).length > 0 ? (
            Object.entries(groupedAnnouncements).map(([courseName, courseAnnouncements], index) => (
              <Box key={index}>
                <Typography variant="h6" gutterBottom>
                  {courseName}
                </Typography>
                <List>
                  {courseAnnouncements.map((announcement, idx) => (
                    <ListItem key={idx} divider>
                      <ListItemText
                        primary={announcement.Announcement}
                        secondary={`Date: ${new Date(announcement.Timestamp).toLocaleString()}`}
                      />
                      {userRole === 'teacher' && (
                        <Button variant="text" color="primary" onClick={() => handleEditClick(announcement)}>
                          Edit
                        </Button>
                      )}
                    </ListItem>
                  ))}
                </List>
                {index < Object.keys(groupedAnnouncements).length - 1 && <Divider sx={{ marginY: 2 }} />}
              </Box>
            ))
          ) : (
            <Typography variant="body1" color="textSecondary" align="center">
              No announcements available.
            </Typography>
          )}
        </Paper>
      </Box>
    </div>
  );
};

export default AnnouncementsPage;
