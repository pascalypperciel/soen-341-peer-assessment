import React, { useState, useEffect } from "react";

const DisplayRatings = () => {
  const [studentId, setStudentId] = useState(null); // Logged-in student's ID
  const [ratings, setRatings] = useState(null); // Ratings data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch logged-in user info to get student ID
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch("/get_user_info", { credentials: "include" });

        if (!response.ok) {
          throw new Error("Unauthorized or session expired");
        }

        const data = await response.json();
        setStudentId(data.user_id); // Set student ID from session
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  // Fetch ratings based on student ID
  useEffect(() => {
    if (!studentId) return;

    const fetchRatings = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/display_ratings?student_id=${studentId}`, {
          credentials: "include",
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch ratings");
        }

        const data = await response.json();
        setRatings(data); // Set ratings data
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRatings();
  }, [studentId]);

  // Loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Error state
  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  // No ratings found
  if (!ratings || ratings.length === 0) {
    return <div>No ratings found for your student ID.</div>;
  }

  // Display ratings
  return (
    <div className="ratings-container">
      <h2>Feedback for Student ID: {studentId}</h2>
      <table>
        <thead>
          <tr>
            <th>Cooperation</th>
            <th>Conceptual Contribution</th>
            <th>Practical Contribution</th>
            <th>Work Ethic</th>
          </tr>
        </thead>
        <tbody>
          {ratings.map((rating, index) => (
            <tr key={index}>
              <td>{rating.CooperationRating}</td>
              <td>{rating.ConceptualContributionRating}</td>
              <td>{rating.PracticalContributionRating}</td>
              <td>{rating.WorkEthicRating}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DisplayRatings;
