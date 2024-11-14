import React, { useState } from 'react';
import axios from 'axios';

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

  if (!show) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Create Announcement</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Course ID:
            <input
              type="text"
              value={courseID}
              onChange={(e) => setCourseID(e.target.value)}
              required
            />
          </label>
          <label>
            Announcement:
            <textarea
              value={announcement}
              onChange={(e) => setAnnouncement(e.target.value)}
              required
            />
          </label>
          <button type="submit">Create</button>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateAnnouncementModal;
