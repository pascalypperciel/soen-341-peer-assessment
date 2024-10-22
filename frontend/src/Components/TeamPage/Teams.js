import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import TeamsList from './TeamsList';
import AddTeamModal from './AddTeamModal';
import '../../App.css';

function Teams() {
  const [teamsData, setTeamsData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [urlEndpoint, setUrlEndpoint] = useState(null);

  const fetchTeams = useCallback(async () => {
    if (urlEndpoint) {
      try {
        const response = await axios.get(urlEndpoint);
        setTeamsData(response.data);
      } catch (error) {
        console.error("Could not retrieve data from server", error);
      }
    }
  }, [urlEndpoint]);

  useEffect(() => {
    const studentId = localStorage.getItem("student_id");
    const teacherId = localStorage.getItem("teacher_id");

    if (studentId) {
      setUrlEndpoint(`http://localhost:5000/displayTeamsStudent?student_id=${studentId}`);
    } else if (teacherId) {
      setUrlEndpoint(`http://localhost:5000/displayTeamsTeacher?teacher_id=${teacherId}`);
    }
  }, []);

  useEffect(() => {
    fetchTeams();
  }, [urlEndpoint, fetchTeams]);

  const handleDelete = (groupId) => {
    setTeamsData(teamsData.filter((team) => team.groupId !== groupId));
  };

  const handleEdit = async (updatedTeam) => {
    setTeamsData((teams) =>
      teams.map((team) => (team.groupId === updatedTeam.groupId ? updatedTeam : team))
    );

    await fetchTeams();
  };

  const handleAddTeam = (newTeam) => {
    setTeamsData([...teamsData, newTeam]);
  };

  const handleModalClose = () => {
    setShowModal(false);
    window.location.reload();
  };

  return (
    <div>
      <div className="add-team-btn-container">
        <button className="add-team-btn" onClick={() => setShowModal(true)}>
          Add New Team
        </button>
      </div>

      {showModal && (
        <div className="modal-container">
          <AddTeamModal
            onAddTeam={handleAddTeam}
            onClose={handleModalClose}
          />
        </div>
      )}

      <TeamsList teams={teamsData} onDelete={handleDelete} onEdit={handleEdit} />
    </div>
  );
}

export default Teams;
