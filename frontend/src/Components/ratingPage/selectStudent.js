// src/components/StudentTeams.js

import React, { useEffect, useState } from "react";
import axios from "axios";

const StudentTeams = () => {
  const [studentId, setStudentId] = useState(null);
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch the student ID from localStorage
    const id = localStorage.getItem("student_id");
    if (id) {
      setStudentId(id);
    } else {
      setError("No student ID found in local storage.");
    }
  }, []);

  useEffect(() => {
    if (studentId) {
      const fetchStudentGroups = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5000/getStudentGroups?student_id=${studentId}`
          ); // Using the constructed URL with studentId
          setGroups(response.data);
        } catch (err) {
          if (err.response && err.response.status === 404) {
            setError("No groups for this student!");
          } else {
            setError("An error occurred while fetching the data.");
          }
        }
      };

      fetchStudentGroups();
    }
  }, [studentId]); // Fetch data only when studentId is available

  return (
    <div>
      <h1>Student Teams</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {studentId && <h2>Student ID: {studentId}</h2>}
      {groups.length > 0 ? (
        <ul>
          {groups.map((group) => (
            <li key={group.GroupID}>
              <h3>
                {group.GroupName} (Course: {group.CourseName})
              </h3>
              <p>Group ID: {group.GroupID}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No groups found.</p>
      )}
    </div>
  );
};

export default StudentTeams;
