import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
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
    <div className="announcements-page">
      <h1>Announcements</h1>
      {userRole === 'teacher' ? (
        <>
          <button onClick={() => setShowModal(true)}>Create Announcement</button>
          <CreateAnnouncementModal
            show={showModal}
            onClose={() => setShowModal(false)}
            onCreate={handleCreateAnnouncement}
          />
        </>
      ) : (
        <p>Viewing as a student.</p>
      )}
      <ul>
        {announcements.length > 0 ? (
          announcements.map((announcement, index) => (
            <li key={index}>
              {announcement.Announcement || announcement}
            </li>
          ))
        ) : (
          <p>No announcements available.</p>
        )}
      </ul>
    </div>
  );
};

export default AnnouncementsPage;
