// PredictionHistory.js

import React from "react";
import { Paper, Typography, List, ListItem, ListItemText, Divider } from "@mui/material";

const PredictionHistory = ({ history }) => {
  return (
    <Paper
      elevation={3}
      style={{
        width: 300,
        padding: 16,
        height: "100vh",
        overflowY: "auto",
        borderRight: "1px solid #ddd",
        backgroundColor: "#ffffff",
      }}
    >
      <Typography variant="h6" gutterBottom>
        Prediction History
      </Typography>
      <Divider />
      {history.length > 0 ? (
        <List dense>
          {history.map((item, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={`Class: ${item.predicted_class}`}
                secondary={`Time: ${new Date(item.timestamp).toLocaleString()}`}
              />
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography variant="body2" style={{ marginTop: 16 }}>
          No history available.
        </Typography>
      )}
    </Paper>
  );
};

export default PredictionHistory;
