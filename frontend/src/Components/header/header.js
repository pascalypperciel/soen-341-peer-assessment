import React from 'react';
import logo from '../Assets/entire-logo.png';
import './header.css';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom'; // Use useNavigate instead of useHistory

const Header = () => {
  const navigate = useNavigate(); 

  const handleLogout = () => {
    
    localStorage.removeItem('userToken'); 

    navigate('/test'); // Change to your login route
  };

  //ADD SOMETHING FOR THE BACKEND


  return (
    <header>
      <div className="header-container">
        <div className="header-logo">
          <img src={logo} alt="The logo" className="image-logo" />
        </div>

        <nav className="nav-bar">
          <div className="center-links">
            <a href="#home">Home</a>
            <a href="#news">News</a>
            <a href="#contact">Contact</a>
          </div>

          <Box sx={{ '& button': { m: 1 } }}>
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
