import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Rating from "@mui/material/Rating";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import SentimentSatisfiedIcon from "@mui/icons-material/SentimentSatisfied";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAltOutlined";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";
import { useNavigate } from "react-router-dom";
import Header from "../header/header";
import Footer from "../footer/footer";
import "./ratingPage.css";
import axios from "axios";
// Styling the icon for the rating
const StyledRating = styled(Rating)(({ theme }) => ({
  "& .MuiRating-iconEmpty .MuiSvgIcon-root": {
    color: theme.palette.action.disabled,
  },
}));

const customIcons = {
  1: {
    icon: <SentimentVeryDissatisfiedIcon color="error" />,
    label: "Very Dissatisfied",
  },
  2: {
    icon: <SentimentDissatisfiedIcon color="error" />,
    label: "Dissatisfied",
  },
  3: {
    icon: <SentimentSatisfiedIcon color="warning" />,
    label: "Neutral",
  },
  4: {
    icon: <SentimentSatisfiedAltIcon color="success" />,
    label: "Satisfied",
  },
  5: {
    icon: <SentimentVerySatisfiedIcon color="success" />,
    label: "Very Satisfied",
  },
};

function IconContainer(props) {
  const { value, ...other } = props;
  return <span {...other}>{customIcons[value].icon}</span>;
}

IconContainer.propTypes = {
  value: PropTypes.number.isRequired,
};

const RatingPage = () => {
  const [cooperationRating, setCooperationRating] = useState(0);
  const [conceptualRating, setConceptualRating] = useState(0);
  const [practicalRating, setPracticalRating] = useState(0);
  const [ethicRating, setEthicRating] = useState(0);
  const [rateeId, setRatedRating] = useState("");
  const [groupId, setGroupId] = useState("");
  const [comments, setComment] = useState("");
  const [availableStudents, setAvailableStudents] = useState([]);
  const [availableGroups, setAvailableGroups] = useState([]);
  const [error, setError] = useState(null);
  const [studentId, setStudentId] = useState(null);
  const [raterId, setRaterId] = useState(null);
  const navigate = useNavigate();

  const handleCooperationChange = (event, newValue) => {
    setCooperationRating(newValue);
  };

  const handleConceptualChange = (event, newValue) => {
    setConceptualRating(newValue);
  };

  const handlePracticalChange = (event, newValue) => {
    setPracticalRating(newValue);
  };

  const handleEthicChange = (event, newValue) => {
    setEthicRating(newValue);
  };

  const handleStudentSelection = (event) => {
    setRatedRating(event.target.value);
  };

  const handleCommentSelection = (event) => {
    setComment(event.target.value);
  };

  const handleGroupSelection = async (event) => {
    const selectedGroupId = event.target.value;
    setGroupId(selectedGroupId);
    await fetchRatees(selectedGroupId);
  };

  const handleRatingSubmission = async () => {
    console.log("Submitting Ratings...");

    if (
      cooperationRating === 0 ||
      conceptualRating === 0 ||
      practicalRating === 0 ||
      ethicRating === 0 ||
      !rateeId ||
      !groupId
    ) {
      alert(
        "Please complete all ratings and select a student and group before submitting."
      );
      return;
    }

    const ratingData = {
      ratee_id: rateeId,
      group_id: groupId,
      cooperation_rating: cooperationRating,
      conceptual_contribution_rating: conceptualRating,
      practical_contribution_rating: practicalRating,
      work_ethic_rating: ethicRating,
      comment: comments,
      rater_id: raterId,
    };

    console.log("Submitting rating data:", ratingData);

    try {
      const response = await axios.post(
        "http://localhost:5000/InsertStudRatings",
        ratingData
      );

      if (response.status === 201 && response.data.message) {
        alert(`Rating submitted for ${rateeId}!`);
        navigate("/teams");
      } else if (response.data.error) {
        console.error(response.data.error);
        alert(`Error: ${response.data.error}`);
      }
    } catch (error) {
      console.error("Error inserting rating:", error);
      alert("Failed to submit rating. Please try again.");
    }
  };

  useEffect(() => {
    const id = localStorage.getItem("student_id");
    if (id) {
      setRaterId(id);
    } else {
      setError("No student ID found in local storage.");
    }
  }, []);

  useEffect(() => {
    if (raterId) {
      const fetchGroups = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5000/getStudentGroups?student_id=${raterId}`
          );
          setAvailableGroups(response.data);
        } catch (err) {
          setError(err.response?.data?.error || "Error fetching groups");
        }
      };

      fetchGroups();
    }
  }, [raterId]);

  const fetchRatees = async (selectedGroupId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/getStudentRatees/${selectedGroupId}?student_id=${raterId}`
      );
      setAvailableStudents(response.data.students);
    } catch (err) {
      setError(err.response?.data?.error || "Error fetching students");
    }
  };

  return (
    <div>
      <Header />
      <div className="container-rating">
        <h2>Welcome to the Peer Evaluation Page</h2>
        <p>
          This evaluation enables students to assess the contributions and
          performance of their teammates across four essential dimensions:
          cooperation, conceptual contribution, practical contribution, and work
          ethic. By focusing on these key areas, students can provide
          constructive feedback that fosters teamwork and enhances overall group
          performance.
        </p>

        <div className="instruction">
          <h4>Anonymous Evaluation Process</h4>
          <p>
            This evaluation is conducted anonymously to encourage honest and
            constructive feedback. Participants will rate their teammates on a
            5-point scale, allowing for a nuanced assessment of contributions
            and performance.
          </p>
        </div>

        <div className="student">
          <p>Please select a group:</p>
          <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
              <InputLabel id="select-group">Teams</InputLabel>
              <Select
                labelId="select-group"
                value={groupId}
                label="Group"
                onChange={handleGroupSelection}
              >
                {availableGroups.map((group) => (
                  <MenuItem key={group.GroupID} value={group.GroupID}>
                    {group.CourseName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <p>Please select a student:</p>
          <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
              <InputLabel id="select-student">Student</InputLabel>
              <Select
                labelId="select-student"
                value={rateeId}
                label="Student"
                onChange={handleStudentSelection}
                disabled={!groupId}
              >
                {availableStudents.map((student) => (
                  <MenuItem key={student.StudentID} value={student.StudentID}>
                    {student.Name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </div>

        <div className="evaluation">
          <h4> Cooperation </h4>
          <p>
            Evaluate your peer's ability to work cooperatively within the group.
          </p>
          <StyledRating
            name="cooperation-rating"
            value={cooperationRating}
            IconContainerComponent={IconContainer}
            getLabelText={(value) => customIcons[value].label}
            highlightSelectedOnly
            onChange={handleCooperationChange}
          />
        </div>

        <div className="evaluation">
          <h4> Conceptual Contribution </h4>
          <p>
            Evaluate your peer's contribution to the group’s overall ideas and
            problem-solving.
          </p>
          <StyledRating
            name="conceptual-rating"
            value={conceptualRating}
            IconContainerComponent={IconContainer}
            getLabelText={(value) => customIcons[value].label}
            highlightSelectedOnly
            onChange={handleConceptualChange}
            classes={{ icon: "rating-icon" }}
          />
        </div>

        <div className="evaluation">
          <h4> Practical Contribution </h4>
          <p>
            Evaluate your peer's ability to work cooperatively within the group.
          </p>
          <StyledRating
            name="practical-rating"
            value={practicalRating}
            IconContainerComponent={IconContainer}
            getLabelText={(value) => customIcons[value].label}
            highlightSelectedOnly
            onChange={handlePracticalChange}
            classes={{ icon: "rating-icon" }}
          />
        </div>

        <div className="evaluation">
          <h4> Work Ethic </h4>
          <p>
            Evaluate your peer's ability to work cooperatively within the group.
          </p>
          <StyledRating
            name="ethic-rating"
            value={ethicRating}
            IconContainerComponent={IconContainer}
            getLabelText={(value) => customIcons[value].label}
            highlightSelectedOnly
            onChange={handleEthicChange}
            classes={{ icon: "rating-icon" }}
          />
        </div>

        <div className="comments">
          <h4> General Comments </h4>
          <p>
            Use this section to provide any overall impressions or suggestions
            for improvement.
          </p>
          <TextField
            name="comment"
            label="Comment"
            multiline
            rows={4}
            variant="outlined"
            onChange={handleCommentSelection}
            fullWidth
          />
        </div>

        <Button
          variant="contained"
          color="primary"
          onClick={handleRatingSubmission}
        >
          Submit
        </Button>
      </div>
      <Footer />
    </div>
  );
};

export default RatingPage;
