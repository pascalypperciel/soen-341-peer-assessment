// StudentRatingsTable.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../header/header";

const StudentRatingsTable = () => {
  const [ratings, setRatings] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch student ratings from the backend
    axios
      .get("http://localhost:5000/getStudentRatings")
      .then((response) => {
        // Log the response data to see if it's being fetched properly
        console.log("Response from backend:", response.data);

        setRatings(response.data);
        setError(null); // Reset the error state if the request succeeds
      })
      .catch((err) => {
        // Handle error if the API call fails
        setError("Failed to load student ratings");
        console.error("Error fetching ratings:", err);
      });
  }, []);
  return (
    <div>
      <Header />
      <h2>Student Ratings</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Student ID </th>
            <th>Student Name</th>
            <th>Teams Name</th>
            <th>Cooperation</th>
            <th>Conceptual Contribution</th>
            <th>Practical Contribution</th>
            <th>Work Ethic</th>
            <th> Peers who reponded</th>
          </tr>
        </thead>
        {/*  Find a way to stop*/}
        <tbody>
          {ratings.length > 0 ? (
            ratings.map((rating) => (
              <tr key={rating.RatingID}>
                <td>{rating.RateeID}</td>
                <td>{rating.RateeName}</td>
                <td>{rating.GroupName}</td>
                <td>{rating.CooperationRating}</td>
                <td>{rating.ConceptualContributionRating}</td>
                <td>{rating.PracticalContributionRating}</td>
                <td>{rating.WorkEthicRating}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="15">No ratings available.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StudentRatingsTable;
