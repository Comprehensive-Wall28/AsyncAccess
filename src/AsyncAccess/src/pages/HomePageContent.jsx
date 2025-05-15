// src/pages/HomePageContent.jsx
import React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

function HomePageContent() {
  return (
    // This Paper provides the rounded border for the main content area
    <Paper
      elevation={3} // Or adjust as needed
      sx={{
        p: 3, // Padding inside the paper
        borderRadius: theme => theme.shape.borderRadius * 1, // Keep rounded corners
        // No need for maxWidth here if you want it to fill the main area
        // Or set a maxWidth like 'lg' or 'xl' if you want the paper centered within the main area
         //maxWidth: 'lg',
         margin: 'auto', // Center if maxWidth is set
      }}
    >
      {/* Container can still be used inside Paper for content max-width if desired */}
      <Container maxWidth="sm"> {/* Or remove if Paper handles width */}
        <Typography variant="h4" gutterBottom>
          Welcome to AsyncAccess
        </Typography>
        <Typography component="p" sx={{ mb: 2 }}>
          This content is inside the main layout, to the right of the drawer.
          The surrounding Paper provides the rounded border.
        </Typography>
        <Button variant="contained" color="primary" sx={{ mr: 1 }}>
          Get Started
        </Button>
        <Button variant="contained" color="secondary">
          Learn More
        </Button>
      </Container>
    </Paper>
  );
}

export default HomePageContent;
