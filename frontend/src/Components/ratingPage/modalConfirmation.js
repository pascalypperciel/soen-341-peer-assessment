import React from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

const ModalConfirmation = ({ open, onClose, onSubmit, ratings }) => {
  // Check if ratings is defined
  if (!ratings) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={
          {
            /* styles */
          }
        }
      >
        <h2>Confirm Ratings</h2>
        <p>Cooperation Rating: {ratings.cooperationRating}</p>
        <p>Conceptual Contribution Rating: {ratings.conceptualRating}</p>
        <p>Practical Contribution Rating: {ratings.practicalRating}</p>
        <p>Work Ethic Rating: {ratings.ethicRating}</p>
        {/* Add more details as needed */}

        <Button onClick={onSubmit}>Confirm</Button>
        <Button onClick={onClose}>Cancel</Button>
      </Box>
    </Modal>
  );
};

export default ModalConfirmation;
