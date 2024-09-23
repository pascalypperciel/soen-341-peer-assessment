import React, { useState } from 'react';
import './SignupPage.css';
import backgroundImage from '../Assets/background2.jpg';
import TextField from '@mui/material/TextField';

const SignupPage = () => {
    const [isTeacher, setIsTeacher] = useState(true);
    const [signupData, setSignupData] = useState({ idOrUsername: '', password: '' });
  
    const handleSignup = async (e) => {
      e.preventDefault();
      const url = isTeacher ? '/api/teachers' : '/api/students';
  
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            [isTeacher ? 'username' : 'studentId']: signupData.idOrUsername,
            password: signupData.password,
          }),
        });
        if (response.ok) {
          console.log('Signup successful');
          // Redirect to login or other page
        } else {
          console.error('Signup failed');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
  
    const handleChange = (e) => {
      setSignupData({
        ...signupData,
        [e.target.name]: e.target.value,
      });
    };
  
    const handleSwitch = (type) => {
      setIsTeacher(type === 'teacher');
      setSignupData({ idOrUsername: '', password: '' }); 
    };
  
    return (
      <div className="container">
        <img src={backgroundImage} alt="Description" className="image" />
        <div className="button-role">
          <button
            className={`button ${isTeacher ? 'active' : ''}`}
            onClick={() => handleSwitch('teacher')}
          >
            Teacher 
          </button>
          <button
            className={`button ${!isTeacher ? 'active' : ''}`}
            onClick={() => handleSwitch('student')}
          >
            Student 
          </button>
        </div>
        
        <div className="info">
          <h1>Sign Up</h1>
          <form onSubmit={handleSignup}>
          <div>
          <TextField
    className='textfield'
    id="filled-basic"
    label={isTeacher ? 'Username' : 'Student ID'}
    variant="filled"
    type={isTeacher ? 'text' : 'text'}
    name="idOrUsername"
    value={signupData.idOrUsername}
    onChange={handleChange}
    required
/>
</div>
<div>
    <TextField
        className='textfield'
        id="filled-password"
        label="Password"
        variant="filled"
        type="password"
        name="password"
        value={signupData.password}
        onChange={handleChange}
        required
    />
</div>
        <button className='button-signup' type="submit">
            Sign Up
        </button>
          </form>
        </div>
      </div>
    );
  };
  
  export default SignupPage;