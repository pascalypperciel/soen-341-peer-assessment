import React from "react";
import logo from "../Assets/entire-logo.png";
import "./header.css";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom"; // Use useNavigate instead of useHistory
import { Link } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userToken");

    navigate("/test"); // Change to your login route
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
            <li>
              <Link to="/teams">Home</Link>
            </li>
            <li>
              <Link to="/ratingPage">Rate a Student</Link>
            </li>
            <li>
              <Link to="/selectStudent">Something</Link>
            </li>
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
