import React, { useState } from 'react';
import './SignupPage.css';
import backgroundImage from '../Assets/background2.jpg';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import homeStudent from './homeStudent';

const SignupPage = () => {
    const [isTeacher, setIsTeacher] = useState(true);
    const [signupData, setSignupData] = useState({ fullName: '', idOrUsername: '', password: '' });
    const [isLogin, setIsLogin] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const navigate = useNavigate();

    const validateForm = () => {
        const { fullName, idOrUsername, password } = signupData;
        const errors = {};

        // Validate Full Name (for signup only)
        if (!isLogin && !/^[a-zA-Z\s]{2,30}$/.test(fullName)) {
            errors.fullName = 'The name is not valid';
        }

        // Validate username or student ID
        if (isTeacher) {
            if (!/^[a-zA-Z]{3,20}$/.test(idOrUsername)) {
                errors.idOrUsername = 'Username is not valid';
            }
        } else {
            if (!/^\d{8}$/.test(idOrUsername)) {
                errors.idOrUsername = 'Student ID must be exactly 8 digits.';
            }
        }

        // Validate password
        if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password)) {
            errors.password = 'Password must be at least 8 characters, include at least one letter and one number';
        }

        return errors;
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setValidationErrors(validationErrors);
            return;
        }

        const url = isTeacher ? '/teacherSignup' : '/studentSignup'; // Updated URL
        try {
            const response = await axios.post(url, {
                [isTeacher ? 'teacherID' : 'studentID']: signupData.idOrUsername, // Use 'teacherID' or 'studentID'
                name: signupData.fullName, // Use 'name' for fullName
                password: signupData.password,
            });

            if (response.status === 200) {
                console.log('Signup successful');
                navigate('/homeStudent');
            } else {
                console.error('Signup failed');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setValidationErrors(validationErrors);
            return;
        }

        const url = isTeacher 
            ? `/teacherLogin?teacherID=${signupData.idOrUsername}&password=${signupData.password}` // Pass parameters in the URL
            : `/studentLogin?studentID=${signupData.idOrUsername}&password=${signupData.password}`;

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const user = await response.json();
                console.log('Login successful:', user);
                navigate(isTeacher ? '/homeTeacher' : '/homeStudent'); // Navigate to appropriate home
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
        setValidationErrors({});
    };

    const handleRoleSwitch = (type) => {
        setIsTeacher(type === 'teacher');
        setSignupData({ fullName: '', idOrUsername: '', password: '' });
    };

    const handleFormSwitch = () => {
        setIsLogin(!isLogin);
        setSignupData({ fullName: '', idOrUsername: '', password: '' });
        setValidationErrors({});
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
                    Professor
                </button>
                <button
                    className={`button ${!isTeacher ? 'active' : ''}`}
                    onClick={() => handleRoleSwitch('student')}
                >
                    Student
                </button>
            </div>
            
            <div className="info">
                <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
                <form onSubmit={isLogin ? handleLogin : handleSignup}>
                    {!isLogin && (
                        <div>
                            <TextField
                                className='textfield'
                                error={!!validationErrors.fullName}
                                id="filled-full-name"
                                label="Full Name"
                                variant="filled"
                                type="text"
                                name="fullName"
                                value={signupData.fullName}
                                onChange={handleChange}
                                helperText={validationErrors.fullName}
                                required
                            />
                        </div>
                    )}

                    <div>
                        <TextField
                            className='textfield'
                            error={!!validationErrors.idOrUsername}
                            id="filled-basic"
                            label={isTeacher ? 'Username' : 'Student ID'}
                            variant="filled"
                            type='text'
                            name="idOrUsername"
                            value={signupData.idOrUsername}
                            onChange={handleChange}
                            helperText={validationErrors.idOrUsername}
                            required
                        />
                    </div>

                    <div>
                        <TextField
                            className='textfield'
                            error={!!validationErrors.password}
                            id="filled-password"
                            label="Password"
                            variant="filled"
                            type="password"
                            name="password"
                            value={signupData.password}
                            onChange={handleChange}
                            helperText={validationErrors.password}
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
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <span onClick={handleFormSwitch} className="signup-link" style={{ cursor: 'pointer', color: '#1860C3', textDecoration: 'underline' }}>
                        {isLogin ? 'Sign Up' : 'Login'}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
