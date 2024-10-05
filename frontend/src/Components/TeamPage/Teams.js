import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Papa from 'papaparse';
import './Teams.css'; 

function Team({ team, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTeam, setEditedTeam] = useState({ ...team });

  const handleEdit = () => {
    if (isEditing) {
      onEdit(editedTeam);
    }
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedTeam((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="team-card">
      {isEditing ? (
        <>
          <input
            type="text"
            name="teamName"
            value={editedTeam.teamName}
            onChange={handleChange}
          />
          <input
            type="text"
            name="course"
            value={editedTeam.course}
            onChange={handleChange}
          />
          <textarea
            name="students"
            value={editedTeam.students.join(", ")}
            onChange={(e) =>
              setEditedTeam({
                ...editedTeam,
                students: e.target.value.split(",").map((s) => s.trim()),
              })
            }
          />
        </>
      ) : (
        <>
          <h2>{team.teamName}</h2>
          <p>
            <strong>Course:</strong> {team.course}
          </p>
          <h4>Students:</h4>
          <ul>
            {team.students.map((student, index) => (
              <li key={index}>{student}</li>
            ))}
          </ul>
        </>
      )}
      <button onClick={handleEdit}>
        {isEditing ? "Save" : "Edit"}
      </button>
      <button onClick={() => onDelete(team.teamName)}>Delete</button>
    </div>
  );
}

function Teams() {
  const [teamsData, setTeamsData] = useState([]); // Initially an empty array
  const [showModal, setShowModal] = useState(false); // Modal visibility state
  const [newTeam, setNewTeam] = useState({
    teamName: "",
    course: "",
    students: "",
  });
  const [csvData, setCsvData] = useState(null); // Holds parsed CSV data

  // Fetch teams data from server
  useEffect(() => {
    async function fetchTeams() {
      try {
        const response = await axios.get('/displayTeams'); // Adjust the URL based on your server setup
        setTeamsData(response.data); // Set the fetched teams data
      } catch (error) {
        console.error("Could not retrieve the data from server", error);
      }
    }

    fetchTeams();
  }, []); // Empty array ensures this runs once on component mount

  // Handle deleting a team
  const handleDelete = (teamName) => {
    setTeamsData(teamsData.filter((team) => team.teamName !== teamName));
  };

  // Handle editing a team
  const handleEdit = (updatedTeam) => {
    setTeamsData(
      teamsData.map((team) =>
        team.teamName === updatedTeam.teamName ? updatedTeam : team
      )
    );
  };

  // Handle input changes in modal form
  const handleNewTeamChange = (e) => {
    const { name, value } = e.target;
    setNewTeam((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle adding a new team manually
  const handleAddTeam = () => {
    const studentsArray = newTeam.students.split(",").map((s) => s.trim());
    const newTeamData = {
      ...newTeam,
      students: studentsArray,
    };

    setTeamsData([...teamsData, newTeamData]);
    setNewTeam({ teamName: "", course: "", students: "" });
    setShowModal(false); // Close the modal after adding the team
  };

  // Handle CSV parsing
  const handleCsvUpload = (e) => {
    const file = e.target.files[0];

    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          const csvTeams = result.data.map((team) => ({
            teamName: team.teamName,
            course: team.course,
            students: team.students.split(",").map((s) => s.trim()),
          }));

          // Append the new teams to the existing list
          setTeamsData((prevTeams) => [...prevTeams, ...csvTeams]);
          setCsvData(csvTeams); // Store CSV data
        },
      });
    }
  };

  return (
    <div>
      <div className="team-list">
        {teamsData.map((team, index) => (
          <Team
            key={index}
            team={team}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        ))}
      </div>

      {/* Button to show the modal */}
      <button className="add-team-btn" onClick={() => setShowModal(true)}>
        Add New Team
      </button>

      {/* Modal for adding a new team */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Add New Team</h2>

            {/* Form for manually adding a team */}
            <input
              type="text"
              name="teamName"
              placeholder="Team Name"
              value={newTeam.teamName}
              onChange={handleNewTeamChange}
            />
            <input
              type="text"
              name="course"
              placeholder="Course"
              value={newTeam.course}
              onChange={handleNewTeamChange}
            />
            <textarea
              name="students"
              placeholder="Enter students, separated by commas"
              value={newTeam.students}
              onChange={handleNewTeamChange}
            />
            <button onClick={handleAddTeam}>Add Team</button>

            {/* Option to upload a CSV file */}
            <h3>Or Upload CSV</h3>
            <input type="file" accept=".csv" onChange={handleCsvUpload} />

            <button onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Teams;
