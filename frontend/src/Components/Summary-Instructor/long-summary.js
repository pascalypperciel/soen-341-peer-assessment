import React, { useState, useEffect } from "react";
import Header from "../header/header";
import Footer from "../footer/footer";
import axios from "axios";
import { useLocation } from "react-router-dom";
import "./long-summary.css";

const LongSummary = () => {
  //Variables
  const [ratings, setRatings] = useState([]);
  const [error, setError] = useState(null);
  const location = useLocation();
  const { groupName } = location.state || {};
  //Call to fetch the ratings of the student ofr the specific teacher
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
  //calculate the average of ratings
  const calculateAverage = (rating) => {
    const total =
      rating.CooperationRating +
      rating.ConceptualContributionRating +
      rating.PracticalContributionRating +
      rating.WorkEthicRating;
    return (total / 4).toFixed(1);
  };

  //Match the current team with the team of the teacher
  const filteredRatings = ratings.filter(
    (rating) => rating.GroupName === groupName
  );

  //select the rater student of the ratee student
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
    <div classname="long-page">
      <Header />
      <div className="container-long">
        <h1>Detailed View of {groupName}</h1>
        {error && <p>{error}</p>}
        {Object.keys(rateeGroups).length > 0 ? (
          Object.values(rateeGroups).map((ratee) => (
            <div key={ratee.rateeId}>
              <p className="nameStudent">
                <b> Student Name:</b> {ratee.rateeName}
              </p>
              <table className="table-long">
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
                      <td>{raterRating.RaterName}</td>
                      <td>{raterRating.CooperationRating}</td>
                      <td>{raterRating.ConceptualContributionRating}</td>
                      <td>{raterRating.PracticalContributionRating}</td>
                      <td>{raterRating.WorkEthicRating}</td>
                      <td>{calculateAverage(raterRating)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="comments">
                {/*The comments of all the students*/}
                <h2>Comments Section:</h2>
                {ratee.ratings.map((raterRating, index) => (
                  <div
                    key={`${ratee.rateeId}-${index}`}
                    className="comment-entry"
                  >
                    <ul>
                      <li className="nameStudent">
                        <b>Member:</b> {raterRating.RaterName}
                      </li>
                      <li className="comment-type">
                        <div className="comment-box">
                          <p>
                            <b>General comments:</b>
                          </p>
                          <p>
                            <i>{raterRating.Comment || "No comments left"}</i>
                          </p>
                        </div>
                      </li>
                      <li className="comment-type">
                        <div className="comment-box ">
                          <p>
                            <b>Cooperation comments:</b>
                          </p>
                          <p>
                            {" "}
                            <i>
                              {raterRating.CooperationComment ||
                                "No comments left"}
                            </i>
                          </p>
                        </div>
                      </li>
                      <li className="comment-type">
                        <div className="comment-box ">
                          <p>
                            <b>Conceptual comments:</b>
                          </p>
                          <p>
                            <i>
                              {" "}
                              {raterRating.ConceptualContributionComment ||
                                "No comments left"}
                            </i>
                          </p>
                        </div>
                      </li>
                      <li className="comment-type">
                        <div className="comment-box ">
                          <p>
                            <b>Practical comments:</b>
                          </p>
                          <p>
                            {" "}
                            <i>
                              {raterRating.PracticalContributionComment ||
                                "No comments left"}
                            </i>
                          </p>
                        </div>
                      </li>
                      <li className="comment-type">
                        <div className="comment-box ">
                          <p>
                            <b>Work Ethic comments:</b>
                          </p>
                          <p>
                            <i>
                              {raterRating.WorkEthicComment ||
                                "No comments left"}
                            </i>
                          </p>
                        </div>
                      </li>
                    </ul>
                  </div>
                ))}
              </p>
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
