import React, { useState, useEffect } from "react";
import logo from "../Assets/entire-logo.png";
import "./header.css";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom"; // Use useNavigate instead of useHistory
import { Link } from "react-router-dom";

const Header = () => {
  const [isTeacher, setIsTeacher] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const studentId = localStorage.getItem("student_id");
    const teacherId = localStorage.getItem("teacher_id");

    // Determine if the user is a teacher or student
    if (teacherId) {
      setIsTeacher(true); // User is a teacher
    } else if (studentId) {
      setIsTeacher(false); // User is a student
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userToken");

    navigate("/");
  };

  //ADD SOMETHING FOR THE BACKEND

  return (
    <header>
      <div className="header-container">
        <div className="header-logo">
          <img src={logo} alt="The logo" className="image-logo" />
        </div>

        <nav className="nav-bar">
          <ul className="center-links">
            {isTeacher ? (
              <>
                <li>
                  <Link to="/teams">Home</Link>
                </li>
                <li>
                  <Link to=""></Link>
                </li>
                <li>
                  <Link to=""></Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/teams">Home</Link>
                </li>
                <li>
                  <Link to="/ratingPage">Rate a Student</Link>
                </li>
                <li>
                  <Link to=""></Link>
                </li>
              </>
            )}
          </ul>

          <Box sx={{ "& button": { m: 1 } }}>
            <Button
              className="logout-button"
              variant="contained"
              size="medium"
              onClick={handleLogout} // Attach logout handler
            >
              Log out
            </Button>
          </Box>
        </nav>
      </div>
    </header>
  );
};

export default Header;
