import React, { useState } from "react";
import "./SignupPage.css";
import backgroundImage from "../Assets/conco-image.jpg";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const SignupPage = () => {
  const [isTeacher, setIsTeacher] = useState(true);
  const [signupData, setSignupData] = useState({
    fullName: "",
    idOrUsername: "",
    password: "",
    newpassword: "",
    confirmpassword: "",
  });

  const [isLogin, setIsLogin] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setConfirmPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleNewPasswordVisibility = () =>
    setShowNewPassword(!showNewPassword);
  const toggleConfirmPasswordVisibility = () =>
    setConfirmPassword(!showConfirmPassword);

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
        "Password must be at least 8 characters, include at least one letter and one number.";
    }

    return errors;
  };

  const validPassword = () => {
    const { newpassword, confirmpassword, idOrUsername } = signupData;
    const errors = {};
    if (isTeacher) {
      if (!/^[a-zA-Z_]{3,20}$/.test(idOrUsername)) {
        errors.idOrUsername = "Username is not valid";
      }
    } else {
      if (!/^\d{8}$/.test(idOrUsername)) {
        errors.idOrUsername = "Student ID must be exactly 8 digits.";
      }
    }
    // Validation for newpassword and confirmpassword (only when not in login mode)

    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(newpassword)) {
      errors.newpassword =
        "New password must be at least 8 characters, include at least one letter and one number.";
    }

    if (newpassword !== confirmpassword) {
      errors.confirmpassword = "Passwords do not match.";
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

    const url = isTeacher
      ? "http://localhost:5000/teacherSignup"
      : "http://localhost:5000/studentSignup";
    try {
      const response = await axios.post(url, {
        [isTeacher ? "username" : "studentID"]: signupData.idOrUsername,
        name: signupData.fullName,
        password: signupData.password,
      });

      if (response.status === 200) {
        console.log("Signup successful");
        const userData = response.data;
        if (isTeacher) {
          localStorage.removeItem("student_id");
          localStorage.setItem("teacher_id", userData.teacher_id);
        } else {
          localStorage.removeItem("teacher_id");
          localStorage.setItem("student_id", userData.student_id);
        }
        console.log("Signed-up user:", userData);
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

    const url = isTeacher
      ? `http://localhost:5000/teacherLogin?username=${signupData.idOrUsername}&password=${signupData.password}`
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
        const data = await response.json();
        const errorMessage = data.message || "Login failed";
        setValidationErrors({
          general: errorMessage,
          ...(data.message.includes("password") && { password: errorMessage }),
          ...(data.message.includes("not found") && {
            idOrUsername: errorMessage,
          }),
        });
      }
    } catch (error) {
      setValidationErrors({
        general: "Either your ",
      });
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

  //To be able to switch depending of the role or the type of registration
  const handleRoleSwitch = (type) => {
    setIsTeacher(type === "teacher");
    setSignupData({ fullName: "", idOrUsername: "", password: "" });
  };

  const handleFormSwitch = () => {
    setIsLogin(!isLogin);
    setSignupData({ fullName: "", idOrUsername: "", password: "" });
    setValidationErrors({});
  };

  const handlePassword = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleNewPassword = async (e) => {
    e.preventDefault();

    // Validate the password
    const validationErrors = validPassword();
    if (Object.keys(validationErrors).length > 0) {
      setValidationErrors(validationErrors);
      return;
    }

    const url = isTeacher
      ? `http://localhost:5000/change_teacher_password?username=${signupData.idOrUsername}`
      : `http://localhost:5000/change_student_password?studentID=${signupData.idOrUsername}`;

    try {
      const response = await axios.put(url, {
        [isTeacher ? "new_teacher_password" : "new_student_password"]:
          signupData.newpassword,
      });

      if (response.status === 200) {
        console.log("Password change successful");
        const userData = response.data;

        if (isTeacher) {
          localStorage.removeItem("student_id");
          localStorage.setItem("teacher_id", userData.teacher_id);
        } else {
          localStorage.removeItem("teacher_id");
          localStorage.setItem("student_id", userData.student_id);
        }

        alert(
          "Password updated successfully! Please login with your new password."
        );
        handleModalClose();
        return;
      }
      if (response.status === 404) {
        const errorMessage =
          response.data?.message ||
          "User not found. Please check your details and try again.";
        setValidationErrors({
          general: errorMessage,
          ...(errorMessage.includes("not found") && {
            idOrUsername: errorMessage,
          }),
        });
        return;
      }

      console.error("Unexpected response:", response.data);
      setValidationErrors({
        general: "An unexpected error occurred. Please try again later.",
      });
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;

        if (status === 404) {
          setValidationErrors({
            idOrUsername: data.message || "User not found.",
          });
        } else {
          setValidationErrors({
            general:
              data.message ||
              "An error occurred while updating the password. Please try again later.",
          });
        }
      } else {
        console.error("Network or server error:", error);
        setValidationErrors({
          general:
            "A network error occurred. Please check your connection and try again.",
        });
      }
    }
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
              type={showPassword ? "text" : "password"}
              name="password"
              value={signupData.password}
              onChange={handleChange}
              helperText={validationErrors.password}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={togglePasswordVisibility}
                      edge="end"
                      sx={{
                        boxShadow: "none",
                        padding: 0,
                      }}
                    >
                      {showPassword ? (
                        <VisibilityIcon
                          sx={{ color: "gray", fontSize: "2rem" }}
                        />
                      ) : (
                        <VisibilityOffIcon
                          sx={{ color: "gray", fontSize: "2rem" }}
                        />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
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

        <div className="change-password"></div>
        <span
          onClick={handlePassword}
          className="password-link"
          style={{
            cursor: "pointer",
            color: "#1860C3",
            textDecoration: "underline",
          }}
        >
          {isLogin ? "Forgot your password? " : ""}
        </span>

        {isModalOpen && (
          <div className="container-modal" onClick={handleModalClose}>
            <div
              className="modal-PSW-content"
              onClick={(e) => e.stopPropagation()}
            >
              <h2>Change Password</h2>
              <form onSubmit={handleNewPassword}>
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
                    error={!!validationErrors.newpassword}
                    id="filled-new-password"
                    label="New Password"
                    variant="filled"
                    type={showNewPassword ? "text" : "password"}
                    name="newpassword"
                    value={signupData.newpassword}
                    onChange={handleChange}
                    helperText={validationErrors.newpassword}
                    required
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={toggleNewPasswordVisibility}
                            edge="end"
                            sx={{
                              boxShadow: "none",
                              padding: 0,
                            }}
                          >
                            {showNewPassword ? (
                              <VisibilityIcon
                                sx={{ color: "gray", fontSize: "2rem" }}
                              />
                            ) : (
                              <VisibilityOffIcon
                                sx={{ color: "gray", fontSize: "2rem" }}
                              />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    className="textfield"
                    error={!!validationErrors.confirmpassword}
                    id="filled-confirm-password"
                    label="Confirm Password"
                    variant="filled"
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmpassword"
                    value={signupData.confirmpassword}
                    onChange={handleChange}
                    helperText={validationErrors.confirmpassword}
                    required
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={toggleConfirmPasswordVisibility}
                            edge="end"
                            sx={{
                              boxShadow: "none",
                              padding: 0,
                            }}
                          >
                            {showConfirmPassword ? (
                              <VisibilityIcon
                                sx={{ color: "gray", fontSize: "2rem" }}
                              />
                            ) : (
                              <VisibilityOffIcon
                                sx={{ color: "gray", fontSize: "2rem" }}
                              />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </div>

                <button className="submitPSW" type="submit">
                  Submit
                </button>
                <button
                  className="closePSW "
                  type="button"
                  onClick={handleModalClose}
                >
                  Close
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignupPage;
