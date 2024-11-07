import React, { useState, useEffect } from "react";
import Header from "../header/header";
import Footer from "../footer/footer";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [ratings, setRatings] = useState([]);
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState(null);
  const teacherId = localStorage.getItem("teacher_id");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:5000/getStudentRatings?teacher_id=${teacherId}`)
      .then((response) => {
        console.log("Response from backend:", response.data);

        setRatings(response.data);
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
  }, []);
  const handleButtonClick = (groupName, viewType) => {
    if (viewType === "Summary") {
      // Navigate to the summary page with groupName as a route parameter
      navigate("/shortsummary", { state: { groupName } });
    }
    if (viewType === "Detail") {
      navigate("/longsummary", { state: { groupName } });
    }
    // You can also handle "Detail" view similarly
    console.log(`${viewType} view for group: ${groupName}`);
  };
  return (
    <div>
      <Header />
      <div>
        <h1>Groups for Teacher {teacherId}</h1>
        {error && <p>{error}</p>}
        {groups.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Group Name</th>
                <th>Actions</th> {/* Add a column for the action buttons */}
              </tr>
            </thead>
            <tbody>
              {groups.map((groupName, index) => (
                <tr key={index}>
                  <td>{groupName}</td>
                  <td>
                    <button
                      onClick={() => handleButtonClick(groupName, "Summary")}
                    >
                      Summary
                    </button>
                    <button
                      onClick={() => handleButtonClick(groupName, "Detail")}
                    >
                      Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No groups found</p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
