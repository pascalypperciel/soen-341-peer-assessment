import React, { useState, useEffect } from "react";
import Header from "../header/header";
import Footer from "../footer/footer";
import axios from "axios";
import { useLocation } from "react-router-dom";
import "./long-summary.css";

const LongSummary = () => {
  const [ratings, setRatings] = useState([]);
  const [error, setError] = useState(null);
  const location = useLocation();
  const { groupName } = location.state || {}; // Get groupName from state

  useEffect(() => {
    const teacherId = localStorage.getItem("teacher_id");

    axios
      .get(`http://localhost:5000/getStudentRatings?teacher_id=${teacherId}`)
      .then((response) => {
        setRatings(response.data);
        setError(null);
      })
      .catch((err) => {
        setError("Failed to load student ratings");
        console.error("Error fetching ratings:", err);
      });
  }, []);

  // Helper function to calculate the average
  const calculateAverage = (rating) => {
    const total =
      rating.CooperationRating +
      rating.ConceptualContributionRating +
      rating.PracticalContributionRating +
      rating.WorkEthicRating;
    return (total / 4).toFixed(1);
  };

  // Filter and group ratings by each ratee within the group
  const filteredRatings = ratings.filter(
    (rating) => rating.GroupName === groupName
  );
  const rateeGroups = filteredRatings.reduce((acc, rating) => {
    if (!acc[rating.RateeID]) {
      acc[rating.RateeID] = {
        rateeName: rating.RateeName,
        rateeId: rating.RateeID,
        ratings: [],
      };
    }
    if (rating.RaterID !== rating.RateeID) {
      acc[rating.RateeID].ratings.push(rating);
    }
    return acc;
  }, {});

  return (
    <div>
      <Header />
      <div className= "container-long">
      {error && <p>{error}</p>}
      {Object.keys(rateeGroups).length > 0 ? (
        Object.values(rateeGroups).map((ratee) => (
          <div key={ratee.rateeId}>
            <p>Team Name: {groupName}</p>
            <p>Student Name: {ratee.rateeName}</p>
            <p>ID: {ratee.rateeId}</p>
            <table style={{ borderCollapse: "collapse" }} border="1">
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Cooperation</th>
                  <th>Conceptual</th>
                  <th>Practical</th>
                  <th>Work Ethic</th>
                  <th>Average</th>
                </tr>
              </thead>
              <tbody>
                {ratee.ratings.map((raterRating, index) => (
                  <tr key={`${ratee.rateeId}-${index}`}>
                    <td>{raterRating.RaterID}</td>
                    <td>{raterRating.CooperationRating}</td>
                    <td>{raterRating.ConceptualContributionRating}</td>
                    <td>{raterRating.PracticalContributionRating}</td>
                    <td>{raterRating.WorkEthicRating}</td>
                    <td>{calculateAverage(raterRating)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p>
              Comments:{" "}
              {ratee.ratings.map((raterRating, index) => (
                <ul key={`${ratee.rateeId}-${index}`}>
                  <td>{raterRating.RaterID}</td>
                  <li>{raterRating.Comment}</li>
                  <li>{raterRating.CooperationComment}</li>
                  <li>{raterRating.ConceptualContributionComment}</li>
                  <li>{raterRating.PracticalContributionComment}</li>
                  <li>{raterRating.WorkEthicComment}</li>
                </ul>
              ))}
            </p>
            <hr />
          </div>
        ))
      ) : (
        <p>No ratings available for this group.</p>
      )}
      </div>
      
      <Footer />
    </div>
  );
};

export default LongSummary;
