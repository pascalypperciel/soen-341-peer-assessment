import React, { useState, useEffect } from "react";
import Header from "../header/header";
import Footer from "../footer/footer";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./dashboard-instructor.css";

const Dashboard = () => {
  //Variables
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState(null);
  const teacherId = localStorage.getItem("teacher_id");
  const navigate = useNavigate();

  //Call to get the different teams for the specific teacher
  useEffect(() => {
    axios
      .get(`http://localhost:5000/getStudentRatings?teacher_id=${teacherId}`)
      .then((response) => {
        console.log("Response from backend:", response.data);
        setError(null);

        const uniqueGroups = [
          ...new Set(response.data.map((rating) => rating.GroupName)),
        ];
        console.log(uniqueGroups);
        setGroups(uniqueGroups);
      })
      .catch((err) => {
        setError("Failed to load student ratings");
        console.error("Error fetching ratings:", err);
      });
  }, [teacherId]);

  //Send the teacher to the correct type of summary
  const handleButtonClick = (groupName, viewType) => {
    const path = viewType === "Summary" ? "/shortsummary" : "/longsummary";
    navigate(path, { state: { groupName } });
    console.log(`${viewType} view for group: ${groupName}`);
  };

  return (
    <div className="dashboard-page">
      <Header />
      <div className="container-dashboard">
        <h1> Teams with Ratings </h1>
        {/* Handle the display if the different teams and the error if it can't load*/}
        {error && <p>{error}</p>}
        {groups.length > 0 ? (
          <div className="dashboard">
            {groups.map((groupName, index) => (
              <div key={index} className="team-container">
                <h3>{groupName}</h3>
                <button onClick={() => handleButtonClick(groupName, "Summary")}>
                  Summary of Results
                </button>
                <button onClick={() => handleButtonClick(groupName, "Detail")}>
                  Detailed Results
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p>No groups found</p>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
