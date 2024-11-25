import React, { useState, useEffect } from "react";
import DisplayRatings from "./hooks/DisplayRatings";

const Feedback = () => {
  const [studentId, setStudentId] = useState(null); // Store student ID
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    // Fetch logged-in user's information
    const fetchUserInfo = async () => {
        try {
          const response = await fetch('/get_user_info');
      
          if (!response.ok) {
            // Check for HTML error response
            const contentType = response.headers.get('Content-Type');
            if (contentType && contentType.includes('text/html')) {
              const errorHtml = await response.text();
              console.error("Received HTML error page:", errorHtml);
              throw new Error("Server returned an HTML error page");
            }
      
            // Otherwise, parse JSON error
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to retrieve user information");
          }
      
          const data = await response.json(); // Parse JSON if valid
          setStudentId(data.user_id);
        } catch (err) {
          setError(err.message || "Failed to retrieve user information");
        } finally {
          setLoading(false);
        }
      };      

    fetchUserInfo();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (!studentId) {
    return <div>Error: Student ID not found.</div>;
  }

  return (
    <div>
      <h1>Feedback Page</h1>
      <DisplayRatings studentId={studentId} />
    </div>
  );
};

export default Feedback;