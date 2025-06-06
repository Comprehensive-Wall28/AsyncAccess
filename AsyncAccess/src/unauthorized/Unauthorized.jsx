import React from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Box, Container, Typography, Button, Paper } from '@mui/material';
import AsyncAccessIcon from '../home-page/components/AsyncAccessIcon';

function Unauthorized() {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        bgcolor: 'background.default',
        p: 3,
      }}
    >
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <AsyncAccessIcon sx={{ fontSize: 60, mb: 2, color: 'primary.main' }} />
          <Typography variant="h4" component="h1" gutterBottom color="text.primary">
            Unauthorized Access
          </Typography>
          <Typography variant="body1" paragraph color="text.secondary">
            You do not have the necessary permissions to access this page. Please check your role or contact support if you believe this is an error.
          </Typography>
          <Box sx={{ mt: 3 }}>
            <Button
              variant="contained"
              color="primary"
              component={RouterLink}
              to="/"
              sx={{ mr: 2 }}
            >
              Go to Home
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => navigate(-1)}
            >
              Go Back
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default Unauthorized;