import React from "react";
import { Modal, Box, Button } from "@mui/material";

const ModalConfirmation = ({ open, onClose, onSubmit, ratings }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <h2>Confirm Ratings</h2>
        <p>Cooperation Rating: {ratings.cooperationRating}</p>
        <p> {ratings.cooperationComment} </p>
        <p>Conceptual Contribution Rating: {ratings.conceptualRating}</p>
        <p> {ratings.conceptualComment} </p>
        <p>Practical Contribution Rating: {ratings.practicalRating}</p>
        <p> {ratings.practicalComment} </p>
        <p>Work Ethic Rating: {ratings.ethicRating}</p>
        <p> {ratings.ethicComment} </p>
        <p>Genral Comments: {ratings.comments}</p>

        <Button
          onClick={onSubmit}
          variant="contained"
          sx={{
            backgroundColor: "#912338",
            color: "white",
            "&:hover": {
              backgroundColor: "#7a1d31",
            },
            marginRight: 2,
          }}
        >
          Confirm
        </Button>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderColor: "#912338",
            color: "#912338",
            "&:hover": {
              borderColor: "#7a1d31",
              color: "#7a1d31",
            },
            marginLeft: 2,
          }}
        >
          Cancel
        </Button>
      </Box>
    </Modal>
  );
};

export default ModalConfirmation;
