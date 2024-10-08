import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TeamsList from './TeamsList';
import AddTeamModal from './AddTeamModal';
import '../../App.css';

function Teams() {
  const [teamsData, setTeamsData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [urlEndpoint, setUrlEndpoint] = useState(null);

  useEffect(() => {
    const studentId = localStorage.getItem("student_id");
    const teacherId = localStorage.getItem("teacher_id");

    if (studentId) {
      setUrlEndpoint(`/displayTeamsStudent?student_id=${studentId}`);
    } else if (teacherId) {
      setUrlEndpoint(`/displayTeamsTeacher?teacher_id=${teacherId}`);
    }
  }, []);

  useEffect(() => {
    async function fetchTeams() {
      if (urlEndpoint) {
        try {
          const response = await axios.get(urlEndpoint);
          setTeamsData(response.data);
        } catch (error) {
          console.error("Could not retrieve data from server", error);
        }
      }
    }
    fetchTeams();
  }, [urlEndpoint]);

  const handleDelete = (teamName) => {
    setTeamsData(teamsData.filter((team) => team.teamName !== teamName));
  };

  const handleEdit = (updatedTeam) => {
    setTeamsData(
      teamsData.map((team) =>
        team.teamName === updatedTeam.teamName ? updatedTeam : team
      )
    );
  };

  const handleAddTeam = (newTeam) => {
    setTeamsData([...teamsData, newTeam]);
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
            onClose={() => setShowModal(false)}
          />
      </div>
      )}

      <TeamsList teams={teamsData} onDelete={handleDelete} onEdit={handleEdit} />
    </div>
  );
}

export default Teams;
