// ModalConfirmation.jsx
import React from "react";
import PropTypes from "prop-types";

const ModalConfirmation = ({ onClose, ratingData, onSubmit }) => {
  return (
    <div className="modal">
      <h2>Confirm Submission</h2>
      <p>Are you sure you want to submit the following ratings?</p>

      <ul>
        <li>Cooperation Rating: {ratingData.cooperationRating}</li>
        <li>Conceptual Contribution Rating: {ratingData.conceptualRating}</li>
        <li>Practical Contribution Rating: {ratingData.practicalRating}</li>
        <li>Work Ethic Rating: {ratingData.ethicRating}</li>
        <li>Comments: {ratingData.comments}</li>
        {/* Add any other details you want to display */}
      </ul>

      <button onClick={onSubmit}>Confirm</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
};

ModalConfirmation.propTypes = {
  onClose: PropTypes.func.isRequired,
  ratingData: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default ModalConfirmation;
