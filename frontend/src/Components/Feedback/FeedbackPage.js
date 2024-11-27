import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Box, Typography, List, ListItem, ListItemText, Paper, Divider } from '@mui/material';
import Header from "../Header/Header";

const FeedbackPage = () => {
  const [groupedFeedback, setGroupedFeedback] = useState({});

  const fetchFeedback = useCallback(async () => {
    try {
      const studentId = localStorage.getItem("student_id");
      if (!studentId) {
        console.error("No student ID found in localStorage");
        return;
      }

      const response = await axios.get(`http://localhost:5000/display_ratings?student_id=${studentId}`);
      if (response.data) {
        const grouped = response.data.reduce((acc, item) => {
          const groupName = item.GroupName || "Unknown Group";
          if (!acc[groupName]) {
            acc[groupName] = [];
          }
          acc[groupName].push(item);
          return acc;
        }, {});
        setGroupedFeedback(grouped);
      }
    } catch (error) {
      console.error("Error fetching feedback:", error);
    }
  }, []);

  useEffect(() => {
    fetchFeedback();
  }, [fetchFeedback]);

  return (
    <div>
      <Header />
      <Box sx={{ padding: 3, maxWidth: 600, margin: '0 auto' }}>
        <Typography variant="h4" align="center" gutterBottom>
          Feedback
        </Typography>
        <Paper elevation={3} sx={{ padding: 2, marginTop: 2 }}>
          {Object.keys(groupedFeedback).length > 0 ? (
            Object.entries(groupedFeedback).map(([groupName, groupFeedback], index) => (
              <Box key={index}>
                <Typography variant="h6" gutterBottom>
                  {`Group: ${groupName}`}
                </Typography>
                <List>
                  {groupFeedback.map((feedbackItem, idx) => (
                    <ListItem key={idx} divider>
                      <ListItemText
                        primary={
                          <>
                            <Typography variant="body2" component="p">
                              <strong>Cooperation:</strong> {feedbackItem.CooperationComment}
                            </Typography>
                            <Typography variant="body2" component="p">
                              <strong>Conceptual Contribution:</strong> {feedbackItem.ConceptualContributionComment}
                            </Typography>
                            <Typography variant="body2" component="p">
                              <strong>Practical Contribution:</strong> {feedbackItem.PracticalContributionComment}
                            </Typography>
                            <Typography variant="body2" component="p">
                              <strong>Work Ethic:</strong> {feedbackItem.WorkEthicComment}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
                {index < Object.keys(groupedFeedback).length - 1 && <Divider sx={{ marginY: 2 }} />}
              </Box>
            ))
          ) : (
            <Typography variant="body1" color="textSecondary" align="center">
              No feedback available.
            </Typography>
          )}
        </Paper>
      </Box>
    </div>
  );
};

export default FeedbackPage;