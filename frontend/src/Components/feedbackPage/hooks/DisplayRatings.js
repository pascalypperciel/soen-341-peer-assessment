import React, { useState, useEffect } from "react";

const DisplayRatings = ({ studentId }) => {
  const [ratings, setRatings] = useState(null); // Store ratings data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    // Fetch ratings from the backend
    const fetchRatings = async () => {
      try {
        setLoading(true); // Start loading
        const response = await fetch(`/display_ratings?student_id=${studentId}`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch ratings");
        }

        const data = await response.json();
        setRatings(data); // Set fetched ratings
      } catch (err) {
        setError(err.message); // Capture error
      } finally {
        setLoading(false); // Stop loading
      }
    };

    if (studentId) {
      fetchRatings();
    } else {
      setError("Student ID is required");
      setLoading(false);
    }
  }, [studentId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (!ratings || ratings.length === 0) {
    return <div>No ratings found for the student.</div>;
  }

  return (
    <div className="ratings-container">
      <h2>Ratings for Student {studentId}</h2>
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

