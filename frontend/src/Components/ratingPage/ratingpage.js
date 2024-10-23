import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Rating from "@mui/material/Rating";
import PropTypes from "prop-types";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import SentimentSatisfiedIcon from "@mui/icons-material/SentimentSatisfied";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAltOutlined";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";
import { useNavigate } from "react-router-dom";
import Header from "../header/header";
import Footer from "../footer/footer";
import "./ratingPage.css";

//Styling the icon for the rating
const StyledRating = styled(Rating)(({ theme }) => ({
  "& .MuiRating-iconEmpty .MuiSvgIcon-root": {
    color: theme.palette.action.disabled,
  },
}));
//Styling the icon for the rating
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
//Styling the icon for the rating
function IconContainer(props) {
  const { value, ...other } = props;
  return <span {...other}>{customIcons[value].icon}</span>;
}
//Styling the icon for the rating
IconContainer.propTypes = {
  value: PropTypes.number.isRequired,
};
const RatingPage = () => {
  const [cooperationRating, setCooperationRating] = useState(0);
  const [conceptualRating, setConceptualRating] = useState(0);
  const [practicalRating, setPracticalRating] = useState(0);
  const [ethicRating, setEthicRating] = useState(0);
  const [rateeId, setRatedRating] = useState(0);
  const [groupId, setGroupId] = useState(0);

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

  const handleRatingSubmission = () => {
    console.log("Submitting Ratings..."); // Confirm button click

    if (
      cooperationRating === null ||
      conceptualRating === null ||
      practicalRating === null ||
      ethicRating === null
    ) {
      alert("Please complete all ratings before submitting.");
      return;
    }

    const ratingData = {
      ratee_id: rateeId,
      group_id: groupId,
      cooperation_rating: cooperationRating,
      conceptual_contribution_rating: conceptualRating,
      practical_contribution_rating: practicalRating,
      work_ethic_rating: ethicRating,
    };

    // Log the rating data
    console.log("Submitting rating data:", ratingData);

    // Make the API call with the collected ratingData
    fetch("/InsertStudRatings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ratingData),
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        if (data.message) {
          alert(`Rating submitted for ${rateeId}!`);
        } else if (data.error) {
          console.error(data.error);
        }
      })
      .catch((error) => console.error("Error inserting rating:", error));
  };

  return (
    <div>
      <Header />
      <div className="container-rating">
        <h2> Welcome to the Peer Evaluation Page </h2>
        <p>
          This evaluation enables students to assess the contributions and
          performance of their teammates across four essential dimensions:
          cooperation, conceptual contribution, practical contribution, and work
          ethic. By focusing on these key areas, students can provide
          constructive feedback that fosters teamwork and enhances overall group
          performance.
        </p>

        <div className="instruction">
          <h4> Anonymous Evaluation Process</h4>
          <p>
            This evaluation is conducted anonymously to encourage honest and
            constructive feedback. Participants will rate their teammates on a
            5-point scale, allowing for a nuanced assessment of contributions
            and performance.
          </p>
        </div>

        <div className="student">
          <p>The student that you are evaluating:</p>
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
          <TextField multiline rows={4} variant="outlined" fullWidth />
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
