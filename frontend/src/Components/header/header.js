import React, { useState, useEffect } from "react";
import logo from "../Assets/entire-logo.png";
import "./header.css";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import AddTeamModal from "../TeamPage/AddTeamModal";

const Header = () => {
  const [isTeacher, setIsTeacher] = useState(false);
  const [teamsData, setTeamsData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const studentId = localStorage.getItem("student_id");
    const teacherId = localStorage.getItem("teacher_id");

    if (teacherId) {
      setIsTeacher(true);
    } else if (studentId) {
      setIsTeacher(false);
    }
  }, []);

  const handleAddTeam = (newTeam) => {
    setTeamsData([...teamsData, newTeam]);
  };

  const handleLogout = () => {
    localStorage.removeItem("userToken");

    navigate("/");
  };

  const [showModal, setShowModal] = useState(false);

  const handleModalClose = () => {
    setShowModal(false);
    window.location.reload();
  };

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
                  <span
                    onClick={() => setShowModal(true)}
                    className="add-team-btn"
                    style={{
                      cursor: "pointer",
                      backgroundColor: "transparent",
                      color: "#912338",
                      textDecoration: "none",
                    }}
                  >
                    Add New Team
                  </span>

                  {showModal && (
                    <div className="modal-container">
                      <AddTeamModal
                        onAddTeam={handleAddTeam}
                        onClose={handleModalClose}
                      />
                    </div>
                  )}
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
              onClick={handleLogout}
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
