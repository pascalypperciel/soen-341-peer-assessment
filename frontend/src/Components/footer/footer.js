import React from 'react';
import logo from '../Assets/entire-logo.png';
import './footer.css';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom'; // Use useNavigate instead of useHistory

const Footer = () => {


  return (
    <div className='container-footer'>
        <p>&copy; {new Date().getFullYear()} Casino's Best Customers. All rights reserved.</p>
    </div>
  );
};

export default Footer;
