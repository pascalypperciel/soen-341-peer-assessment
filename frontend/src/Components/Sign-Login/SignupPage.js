import React, { useState } from "react";
import "./SignupPage.css";
import backgroundImage from "../Assets/conco-image.jpg";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SignupPage = () => {
  const [isTeacher, setIsTeacher] = useState(true);
  const [signupData, setSignupData] = useState({
    fullName: "",
    idOrUsername: "",
    password: "",
  });
  const [isLogin, setIsLogin] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const { fullName, idOrUsername, password } = signupData;
    const errors = {};

    if (!isLogin && !/^[a-zA-Z\s]{1,100}$/.test(fullName)) {
      errors.fullName = "The name is not valid";
    }

    if (isTeacher) {
      if (!/^[a-zA-Z_]{3,20}$/.test(idOrUsername)) {
        errors.idOrUsername = "Username is not valid";
      }
    } else {
      if (!/^\d{8}$/.test(idOrUsername)) {
        errors.idOrUsername = "Student ID must be exactly 8 digits.";
      }
    }

    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password)) {
      errors.password =
        "Password must be at least 8 characters, include at least one letter and one number";
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

    const url = isTeacher ? "http://localhost:5000/teacherSignup" : "http://localhost:5000/studentSignup";
    try {
      const response = await axios.post(url, {
        [isTeacher ? "username" : "studentID"]: signupData.idOrUsername,
        name: signupData.fullName,
        password: signupData.password,
      });

      if (response.status === 200) {
        console.log("Signup successful");
        navigate("/teams");
      } else {
        console.error("Signup failed");
      }
    } catch (error) {
      console.error("Error:", error);
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
      ? `http://localhost:5000/teacherLogin?username=${signupData.idOrUsername}&password=${signupData.password}` // Pass parameters in the URL
      : `http://localhost:5000/studentLogin?studentID=${signupData.idOrUsername}&password=${signupData.password}`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const user = await response.json();

        if (isTeacher) {
          localStorage.removeItem("student_id");
          localStorage.setItem("teacher_id", user.teacher_id);
        } else {
          localStorage.removeItem("teacher_id");
          localStorage.setItem("student_id", user.student_id);
        }

        console.log("Login successful:", user);
        navigate("/teams");
      } else {
        console.error("Login failed");
      }
    } catch (error) {
      console.error("Error:", error);
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
    setIsTeacher(type === "teacher");
    setSignupData({ fullName: "", idOrUsername: "", password: "" });
  };

  const handleFormSwitch = () => {
    setIsLogin(!isLogin);
    setSignupData({ fullName: "", idOrUsername: "", password: "" });
    setValidationErrors({});
  };

  return (
    <div className="container">
      <img src={backgroundImage} alt="Description" className="image" />

      <div className="peer-title">
        <h2>Concordia University</h2>
      </div>

      <div className="info">
        <h1>{isLogin ? "Login" : "Sign Up"}</h1>

        <div className="button-role">
          <button
            className={`button ${isTeacher ? "active" : ""}`}
            onClick={() => handleRoleSwitch("teacher")}
          >
            Professor
          </button>
          <button
            className={`button ${!isTeacher ? "active" : ""}`}
            onClick={() => handleRoleSwitch("student")}
          >
            Student
          </button>
        </div>

        <form onSubmit={isLogin ? handleLogin : handleSignup}>
          {!isLogin && (
            <div>
              <TextField
                className="textfield"
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
              className="textfield"
              error={!!validationErrors.idOrUsername}
              id="filled-basic"
              label={isTeacher ? "Username" : "Student ID"}
              variant="filled"
              type="text"
              name="idOrUsername"
              value={signupData.idOrUsername}
              onChange={handleChange}
              helperText={validationErrors.idOrUsername}
              required
            />
          </div>

          <div>
            <TextField
              className="textfield"
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

          <Button type="submit" variant="contained" className="button-signup">
            {isLogin ? "Login" : "Sign Up"}
          </Button>
        </form>

        <div className="signup-prompt">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span
            onClick={handleFormSwitch}
            className="signup-link"
            style={{
              cursor: "pointer",
              color: "#1860C3",
              textDecoration: "underline",
            }}
          >
            {isLogin ? "Sign Up" : "Login"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
