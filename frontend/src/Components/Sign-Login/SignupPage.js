import React, { useState } from 'react';
import './SignupPage.css';
import backgroundImage from '../Assets/background2.jpg';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button'; 
import { Link, useNavigate } from 'react-router-dom';

const SignupPage = () => {
    const [isTeacher, setIsTeacher] = useState(true);
    const [signupData, setSignupData] = useState({ idOrUsername: '', password: '' });
    const [isLogin, setIsLogin] = useState(false); // New state to control login/signup
    const navigate = useNavigate();

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
          navigate('/login');
        } else {
          console.error('Signup failed');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    const handleLogin = async (e) => {
      e.preventDefault();
      const url = isTeacher ? '/api/teachers/login' : '/api/students/login'; // Adjust login URL

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
          console.log('Login successful');
          navigate('/dashboard'); // Navigate to a different page after login
        } else {
          console.error('Login failed');
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

    const handleRoleSwitch = (type) => {
      setIsTeacher(type === 'teacher');
      setSignupData({ idOrUsername: '', password: '' });
    };

    const handleFormSwitch = () => {
      setIsLogin(!isLogin); // Toggle between login and signup
      setSignupData({ idOrUsername: '', password: '' }); // Reset fields
    };

    return (
      <div className="container">
        <img src={backgroundImage} alt="Description" className="image" />

        <div className='peer-title'>
          <h2> Peer Assessment </h2>
        </div>

        <div className="button-role">
          <button
            className={`button ${isTeacher ? 'active' : ''}`}
            onClick={() => handleRoleSwitch('teacher')}
          >
            Teacher
          </button>
          <button
            className={`button ${!isTeacher ? 'active' : ''}`}
            onClick={() => handleRoleSwitch('student')}
          >
            Student
          </button>
        </div>
        
        <div className="info">
          <h1>{isLogin ? (isTeacher ? 'Login' : 'Login') : (isTeacher ? 'Sign Up' : 'Sign Up')}</h1>
          <form onSubmit={isLogin ? handleLogin : handleSignup}>
          {!isLogin && (
      <div>
        <TextField
          className="textfield"
          id="filled-basic"
          label="Full Name"
          variant="filled"
          type="text"
          name="fullName" // Use a different name if needed
          value={signupData.fullName} // Ensure fullName is in your signupData state if needed
          onChange={handleChange}
          required
        />
      </div>
    )}

            <div>
              <TextField
                className='textfield'
                id="filled-basic"
                label={isTeacher ? 'Username' : 'Student ID'}
                variant="filled"
                type='text'
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
            
            <Button
              className='button-signup'
              type="submit"
              variant="contained"
              sx={{
                color: 'white',
                backgroundColor: '#1860C3',
                '&:hover': {
                  backgroundColor: '#0056b3',
                },
                transition: 'background-color 0.3s ease, color 0.3s ease',
                width: "300px",
                borderRadius: '20px',
              }}
            >
              {isLogin ? 'Login' : 'Sign Up'}
            </Button>
          </form>
    
          <div className="signup-prompt">
                    {isLogin 
                        ? "Don't have an account? " 
                        : "Already have an account? "
                    }
                    <span onClick={() => setIsLogin(!isLogin)} className="signup-link" style={{ cursor: 'pointer', color: '#1860C3', textDecoration: 'underline' }}>
                        {isLogin ? 'Sign Up' : 'Login'}
                    </span>
                </div>

        </div>
      </div>
    );
};

export default SignupPage;
