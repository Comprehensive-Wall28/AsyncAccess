import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../services/authService';
import {  Container, Typography, Grid, Card, CardContent, Button, CircularProgress, Alert, CardActions, Box } from '@mui/material'; // Added Box

const FeaturedEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/events/'); 
        // Assuming response.data is an array of events. Slice to get top 3.
        setEvents(Array.isArray(response.data) ? response.data.slice(0, 3) : []);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch events.');
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleEventClick = (eventId) => {
    navigate(`/events/${eventId}`);
  };

  if (loading) {
    return (
      <Container sx={{ py: { xs: 4, sm: 6 }, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: { xs: 4, sm: 6 } }}>
        <Alert severity="error">Error loading events: {error}</Alert>
      </Container>
    );
  }

  if (!events.length) {
    return (
      <Container sx={{ py: { xs: 4, sm: 6 } }}>
        <Typography variant="h6" align="center" color="text.secondary">
          No featured events at the moment. Come back later!
        </Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ py: { xs: 4, sm: 6 } }} id="featured-events">
      <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mb: 4, fontWeight: 'medium' }}>
        Featured Events
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        {events.map((event) => (
          <Grid item key={event._id || event.id} xs={12} sm={6} md={4}> 
            <Card sx={{ 
              height: 250, // Changed from 320 to make it smaller
              display: 'flex', 
              flexDirection: 'column', 
              transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out', 
              '&:hover': { transform: 'scale(1.03)', boxShadow: (theme) => theme.shadows[6], cursor: 'pointer' } 
            }} onClick={() => handleEventClick(event._id || event.id)}>
              
              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}> {/* Ensure CardContent is flex column */}
                <Typography gutterBottom variant="h5" component="div" sx={{ 
                  fontWeight: 'medium',
                  display: '-webkit-box', // Added for title clamping
                  WebkitLineClamp: 2,    // Clamp title to 2 lines
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  minHeight: '2.4em' // Approx 2 lines for h5 (adjust if line-height differs)
                }}>
                  {event.title || 'Untitled Event'}
                </Typography>
                
                {/* Spacer to push date/location and actions to bottom */}
                <Box sx={{ flexGrow: 1 }} /> 

                {event.date && (
                  <Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.secondary' }}>
                    Date: {new Date(event.date).toLocaleDateString()}
                  </Typography>
                )}
                {event.location && (
                  <Typography variant="caption" display="block" sx={{ 
                    color: 'text.secondary',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    width: '100%' // Ensure Typography takes full width to allow ellipsis calculation
                  }}>
                    Location: {event.location}
                  </Typography>
                )}
              </CardContent>
              <CardActions sx={{ justifyContent: 'flex-start', p: 2 }}>
                {/* Button can be kept for explicit action or removed if card click is sufficient */}
                <Button size="small" variant="contained" color="primary" onClick={(e) => { e.stopPropagation(); handleEventClick(event._id || event.id); }}>
                  View Details
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default FeaturedEvents;
