import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../header/header";
import { useLocation } from "react-router-dom";
import "./short-summary.css";
import Footer from "../footer/footer";

const ShortSummary = () => {
  const [ratings, setRatings] = useState([]);
  const [error, setError] = useState(null);
  const location = useLocation();
  const { groupName } = location.state || {};

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

  const rateeAverages = ratings
    .filter((rating) => rating.GroupName === groupName)
    .reduce((acc, rating) => {
      const {
        RateeID,
        RateeName,
        GroupName,
        CooperationRating,
        ConceptualContributionRating,
        PracticalContributionRating,
        WorkEthicRating,
        RaterID,
      } = rating;

      if (!acc[RateeID]) {
        acc[RateeID] = {
          RateeID,
          RateeName,
          GroupName,
          CooperationTotal: 0,
          ConceptualTotal: 0,
          PracticalTotal: 0,
          WorkEthicTotal: 0,
          numResponses: 0,
        };
      }
      if (RaterID !== RateeID) {
        acc[RateeID].CooperationTotal += CooperationRating;
        acc[RateeID].ConceptualTotal += ConceptualContributionRating;
        acc[RateeID].PracticalTotal += PracticalContributionRating;
        acc[RateeID].WorkEthicTotal += WorkEthicRating;
        acc[RateeID].numResponses += 1;
      }

      return acc;
    }, {});

  return (
    <div className="short-page ">
      <Header />
      <div className="container-short">
        <h1>Student Ratings</h1>
        {error && <p>{error}</p>}
        <table className="table-short">
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Student Name</th>
              <th>Team Name</th>
              <th>Cooperation</th>
              <th>Conceptual Contribution</th>
              <th>Practical Contribution</th>
              <th>Work Ethic</th>
              <th>Average</th>
              <th>Peers Who Responded</th>
            </tr>
          </thead>
          <tbody>
            {Object.values(rateeAverages).length > 0 ? (
              Object.values(rateeAverages).map((ratee) => {
                const {
                  RateeID,
                  RateeName,
                  GroupName,
                  CooperationTotal,
                  ConceptualTotal,
                  PracticalTotal,
                  WorkEthicTotal,
                  numResponses,
                } = ratee;

                const avgCooperation = (
                  CooperationTotal / numResponses
                ).toFixed(2);
                const avgConceptual = (ConceptualTotal / numResponses).toFixed(
                  2
                );
                const avgPractical = (PracticalTotal / numResponses).toFixed(2);
                const avgWorkEthic = (WorkEthicTotal / numResponses).toFixed(2);
                const overallAverage = (
                  (parseFloat(avgCooperation) +
                    parseFloat(avgConceptual) +
                    parseFloat(avgPractical) +
                    parseFloat(avgWorkEthic)) /
                  4
                ).toFixed(2);

                return (
                  <tr key={RateeID}>
                    <td>{RateeID}</td>
                    <td>{RateeName}</td>
                    <td>{GroupName}</td>
                    <td>{avgCooperation}</td>
                    <td>{avgConceptual}</td>
                    <td>{avgPractical}</td>
                    <td>{avgWorkEthic}</td>
                    <td>{overallAverage}</td>
                    <td>{numResponses}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="9">No ratings available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Footer />
    </div>
  );
};

export default ShortSummary;
