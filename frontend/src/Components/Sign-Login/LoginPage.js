import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignupPage.css';
import backgroundImage from '../Assets/background.jpg';



const LoginPage = () => {
  const [isTeacher, setIsTeacher] = useState(true); // Toggle between Teacher and Student login
  const [credentials, setCredentials] = useState({ idOrUsername: '', password: '' });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const url = isTeacher 
      ? `/api/teachers?username=${credentials.idOrUsername}&password=${credentials.password}`
      : `/api/students?studentId=${credentials.idOrUsername}&password=${credentials.password}`;

    try {
      const response = await fetch(url, { method: 'GET' });
      if (response.ok) {
        const user = await response.json();
        console.log('Login successful:', user);
        // Redirect to the dashboard or another page
      } else {
        console.error('Login failed');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleSwitch = (type) => {
    setIsTeacher(type === 'teacher');
    setCredentials({ idOrUsername: '', password: '' }); // Reset the form fields
  };

  return (
    <div className = "container">
      <img src={backgroundImage} alt="Description" className="image" />
        <div className="button-container">
          <button
            className={`button ${isTeacher ? 'active' : ''}`}
            onClick={() => handleSwitch('teacher')}
          >
            Teacher Sign Up
          </button>
          <button
            className={`button ${!isTeacher ? 'active' : ''}`}
            onClick={() => handleSwitch('student')}
          >
            Student Sign Up
          </button>
        </div>
      <div className = "info">
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <div>
          <label>{isTeacher ? 'Username' : 'Student ID'}</label>
          <input
            type={isTeacher ? 'text' : 'text'}
            name="idOrUsername"
            value={credentials.idOrUsername}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <button onClick={() => navigate('/signup')}>Go to Sign up</button> 
      </div>
    </div>
  );
};

export default LoginPage;
