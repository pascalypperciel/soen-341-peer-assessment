import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Feedback.css';

function Feedback() {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [ratingsPerPage] = useState(5); // Number of ratings per page
  const [sortOrder, setSortOrder] = useState('date');
  const studentId = 123; // Replace with actual logged-in student's ID

  // Fetch ratings for the logged-in student
  useEffect(() => {
    axios.get(`/api/ratings?studentId=${studentId}`)
      .then(response => {
        setRatings(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("There was an error fetching the ratings!", error);
        setLoading(false);
      });
  }, [studentId]);

  // Calculate the average rating
  const averageRating = (ratings.length > 0)
    ? (ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length).toFixed(2)
    : 0;

  // Sort and filter ratings
  const sortedRatings = [...ratings].sort((a, b) => {
    if (sortOrder === 'date') {
      return new Date(b.date) - new Date(a.date);
    } else {
      return b.rating - a.rating;
    }
  });

  // Pagination logic
  const indexOfLastRating = currentPage * ratingsPerPage;
  const indexOfFirstRating = indexOfLastRating - ratingsPerPage;
  const currentRatings = sortedRatings.slice(indexOfFirstRating, indexOfLastRating);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="feedback-page">
      <h1>Your Feedback</h1>
      
      {loading ? (
        <p>Loading feedback...</p>
      ) : (
        <>
          <div className="feedback-summary">
            <p><strong>Average Rating:</strong> {averageRating} ({ratings.length} ratings)</p>
            
            <label htmlFor="sortOrder">Sort by:</label>
            <select id="sortOrder" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
              <option value="date">Date</option>
              <option value="rating">Rating</option>
            </select>
          </div>

          {ratings.length === 0 ? (
            <p>No feedback available</p>
          ) : (
            <div className="feedback-list">
              {currentRatings.map((rating, index) => (
                <div className="feedback-card" key={index}>
                  <p><strong>From:</strong> {rating.fromStudentName}</p>
                  <p><strong>Rating:</strong> {rating.rating}</p>
                  <p><strong>Comments:</strong> {rating.comment}</p>
                  <p><small>Date: {new Date(rating.date).toLocaleDateString()}</small></p>
                </div>
              ))}
            </div>
          )}

          <div className="pagination">
            {Array.from({ length: Math.ceil(ratings.length / ratingsPerPage) }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => paginate(i + 1)}
                className={currentPage === i + 1 ? 'active' : ''}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Feedback;
