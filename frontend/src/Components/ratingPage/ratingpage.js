import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
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
    transition: "transform 0.2s ease-in-out", // Smooth transition for hover
  },
}));

const customIcons = {
  1: {
    icon: (
      <SentimentVeryDissatisfiedIcon color="error" style={{ fontSize: 40 }} />
    ),
    label: "Very Dissatisfied",
  },
  2: {
    icon: (
      <SentimentDissatisfiedIcon
        color="error"
        style={{ fontSize: 40, margin: "0 10px" }}
      />
    ),
    label: "Dissatisfied",
  },
  3: {
    icon: (
      <SentimentSatisfiedIcon
        color="warning"
        style={{ fontSize: 40, margin: "0 10px" }}
      />
    ),
    label: "Neutral",
  },
  4: {
    icon: (
      <SentimentSatisfiedAltIcon
        color="success"
        style={{ fontSize: 40, margin: "0 10px" }}
      />
    ),
    label: "Satisfied",
  },
  5: {
    icon: (
      <SentimentVerySatisfiedIcon
        color="success"
        style={{ fontSize: 40, margin: "0 10px" }}
      />
    ),
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
  //Define the variables
  const [cooperationRating, setCooperationRating] = useState(0);
  const [cooperationComment, setCooperationComment] = useState("");
  const [conceptualRating, setConceptualRating] = useState(0);
  const [conceptualComment, setConceptualComment] = useState("");
  const [practicalRating, setPracticalRating] = useState(0);
  const [practicalComment, setPracticalComment] = useState("");
  const [ethicRating, setEthicRating] = useState(0);
  const [ethicComment, setEthicComment] = useState("");
  const [rateeId, setRatedRating] = useState("");
  const [groupId, setGroupId] = useState("");
  const [comments, setComment] = useState("");
  const [availableStudents, setAvailableStudents] = useState([]);
  const [availableGroups, setAvailableGroups] = useState([]);
  const [error, setError] = useState(null);
  const [raterId, setRaterId] = useState(null);
  const navigate = useNavigate();

  //set all the variables with there value
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
    const value = event.target.value;
    if (!value) return null;
    setComment(value);
  };

  const handleCooperationComment = (event) => {
    const value = event.target.value;
    if (!value) return null;
    setCooperationComment(value);
  };

  const handleConceptualComment = (event) => {
    const value = event.target.value;
    if (!value) return null;
    setConceptualComment(value);
  };
  const handlePracticalComment = (event) => {
    const value = event.target.value;
    if (!value) return null;
    setPracticalComment(value);
  };
  const handleEthicComment = (event) => {
    const value = event.target.value;
    if (!value) return null;
    setEthicComment(value);
  };

  const handleGroupSelection = async (event) => {
    const selectedGroupId = event.target.value;
    setGroupId(selectedGroupId);
    await fetchRatees(selectedGroupId);
  };

  //When the button Submit is clicked
  const handleRatingSubmission = async () => {
    console.log("Submitting Ratings...");

    //check that all the rating are completed
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

    //Initialize the variable with there value
    const ratingData = {
      ratee_id: rateeId,
      group_id: groupId,
      cooperation_rating: cooperationRating,
      conceptual_contribution_rating: conceptualRating,
      practical_contribution_rating: practicalRating,
      work_ethic_rating: ethicRating,
      comment: comments,
      rater_id: raterId,
      cooperation_comment: cooperationComment,
      conceptual_contribution_comment: conceptualComment,
      practical_contribution_comment: practicalComment,
      work_ethic_comment: ethicComment,
    };

    //Debug
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

  //Fetch the Rater Id
  useEffect(() => {
    const id = localStorage.getItem("student_id");
    if (id) {
      setRaterId(id);
    } else {
      setError("No student ID found in local storage.");
    }
  }, []);

  //Fetch all the group the student is inside
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

  //Fetch all the student they need to rate
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
        <h1>Welcome to the Peer Evaluation Page</h1>
        <p>
          This evaluation enables students to assess the contributions and
          performance of their teammates across four essential dimensions:
          cooperation, conceptual contribution, practical contribution, and work
          ethic. By focusing on these key areas, students can provide
          constructive feedback that fosters teamwork and enhances overall group
          performance.
        </p>

        <div className="instruction">
          <h2>Anonymous Evaluation Process</h2>
          <p>
            This evaluation is conducted anonymously to encourage honest and
            constructive feedback. Participants will rate their teammates on a
            5-point scale, allowing for a nuanced assessment of contributions
            and performance.
          </p>
        </div>

        <div className="student">
          <h4>Please select a group:</h4>
          <Box
            sx={{
              width: {
                xs: 50,
                sm: 75,
                md: 200,
              },
            }}
          >
            <FormControl fullWidth margin="normla">
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

          <h4>Please select a student:</h4>
          <Box
            sx={{
              width: {
                xs: 50,
                sm: 75,
                md: 200,
              },
            }}
          >
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
          <h2> Cooperation </h2>
          <p>
            <p>
              <strong>Cooperation Evaluation</strong>
              <br />
              Evaluate your peer's ability to work collaboratively within the
              group by considering the following criteria:
              <br />
              <br />
              <strong>• Active Participation:</strong> How effectively does the
              individual contribute to meetings?
              <br />
              <strong>• Communication Skills:</strong> Is the peer proactive in
              communicating ideas and updates with the group?
              <br />
              <strong>• Team Cooperation:</strong> How well do they cooperate
              with others to achieve common goals?
              <br />
              <strong>• Supportiveness:</strong> Do they assist teammates when
              challenges arise?
              <br />
              <strong>• Initiative:</strong> Are they willing to volunteer for
              tasks and responsibilities?
            </p>
          </p>
          <Stack spacing={1}>
            <StyledRating
              name="cooperation-rating"
              value={cooperationRating}
              IconContainerComponent={IconContainer}
              getLabelText={(value) => customIcons[value].label}
              highlightSelectedOnly
              size="large"
              onChange={handleCooperationChange}
            />
          </Stack>
          <TextField
            className="textfield"
            name="cooperation-rating"
            label="Cooperation Comments"
            multiline
            rows={4}
            variant="outlined"
            onChange={handleCooperationComment}
            fullWidth
          />
        </div>

        <div className="evaluation">
          <h2> Conceptual Contribution </h2>
          <p>
            <strong>Conceptual Contribution</strong>
            <br />
            Evaluate your peer's ability to contribute conceptually by
            considering the following aspects:
            <br />
            <br />
            <strong>• Researching and Gathering Information:</strong> How
            effectively do they source relevant information?
            <br />
            <strong>• Quality of Individual Contribution:</strong> Is their
            input valuable and insightful?
            <br />
            <strong>• Suggesting Ideas:</strong> Are they proactive in proposing
            new concepts?
            <br />
            <strong>• Tying Ideas Together:</strong> How well do they integrate
            different ideas into a cohesive narrative?
            <br />
            <strong>• Identifying Difficulties:</strong> Can they pinpoint
            challenges within the project?
            <br />
            <strong>• Identifying Effective Approaches:</strong> Do they
            recognize and recommend practical solutions?
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
          <TextField
            className="textfield"
            name="conceptual-rating"
            label="Conceptual Contribution Comments"
            multiline
            rows={4}
            variant="outlined"
            onChange={handleConceptualComment}
            fullWidth
          />
        </div>

        <div className="evaluation">
          <h2> Practical Contribution </h2>
          <p>
            <strong>Practical Contribution</strong>
            <br />
            Assess your peer's practical contributions through the following
            criteria:
            <br />
            <br />
            <strong>• Writing of Reports:</strong> How well do they document
            findings and conclusions?
            <br />
            <strong>• Reviewing Others' Reports:</strong> Are they thorough in
            their evaluations of team members’ work?
            <br />
            <strong>• Providing Constructive Feedback:</strong> Do they offer
            helpful insights on reports or presentations?
            <br />
            <strong>• Contributing to Organization:</strong> How effectively do
            they help in structuring the work?
            <br />
            <strong>• Preparing Presentations:</strong> Are they involved in the
            preparation of presentations (if applicable)?
          </p>
          <StyledRating
            className="practical-rating"
            name="practical-rating"
            value={practicalRating}
            IconContainerComponent={IconContainer}
            getLabelText={(value) => customIcons[value].label}
            highlightSelectedOnly
            onChange={handlePracticalChange}
            classes={{ icon: "rating-icon" }}
          />
          <TextField
            className="textfield"
            name="practical-rating"
            label="Practical Contribution Comments"
            multiline
            rows={4}
            variant="outlined"
            onChange={handlePracticalComment}
            fullWidth
          />
        </div>

        <div className="evaluation">
          <h2> Work Ethic </h2>
          <p>
            <strong>Work Ethic</strong>
            <br />
            Evaluate your peer's work ethic by considering these points:
            <br />
            <br />
            <strong>• Displaying a Positive Attitude:</strong> Do they maintain
            enthusiasm and motivation within the team?
            <br />
            <strong>• Respecting Team-mates:</strong> Are they considerate of
            others' opinions and feelings?
            <br />
            <strong>• Respecting Commitments:</strong> Do they follow through on
            promises and obligations?
            <br />
            <strong>• Meeting Deadlines:</strong> Are they punctual in
            delivering their work?
            <br />
            <strong>• Respecting Team-mates' Ideas:</strong> Do they value and
            acknowledge the contributions of others?
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
          <TextField
            className="textfield"
            name="ethic-rating"
            label="Work Ethic Comments"
            multiline
            rows={4}
            variant="outlined"
            onChange={handleEthicComment}
            fullWidth
          />
        </div>

        <div className="comments">
          <h2> General Comments </h2>
          <p>
            Use this section to provide any overall impressions or suggestions
            for improvement.
          </p>
          <TextField
            className="textfield"
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
          className="custom-button"
        >
          Submit
        </Button>
      </div>
      <Footer />
    </div>
  );
};

export default RatingPage;
