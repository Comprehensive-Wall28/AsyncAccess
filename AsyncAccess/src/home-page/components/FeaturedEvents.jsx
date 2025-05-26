import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom'; // Import RouterLink
import { apiClient } from '../../services/authService';
import {  Container, Typography, Grid, Card, CardContent, Button, CircularProgress, Alert, Box } from '@mui/material';

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
            <RouterLink to={`/events/${event._id || event.id}`} style={{ textDecoration: 'none', display: 'block' }}>
              <Card sx={{
                // ml: 7.5, // Removed as Grid justifyContent="center" should handle alignment
                width: '300px', // Fixed width like in Events.jsx
                height: '250px', // Fixed height like in Events.jsx
                display: 'flex',
                flexDirection: 'column',
                boxShadow: 3,
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                '&:hover': {
                  boxShadow: 8,
                  transform: 'scale(1.03)',
                },
                margin: 'auto' // Added to help center cards within the grid item if needed
              }}>
                <CardContent sx={{
                  flexGrow: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  p: 0.5,
                  pt: 0.25,
                  overflow: 'hidden'
                }}>
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="div"
                    sx={{
                      mt: 3,
                      textAlign: 'center',
                      fontWeight: 'medium',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: '3', // Max 3 lines for title
                      WebkitBoxOrient: 'vertical',
                      minHeight: '3.6em' // Approximate height for 3 lines (adjust if line-height differs)
                    }}
                  >
                    {event.title || 'Untitled Event'}
                  </Typography>

                  <Box sx={{ pt: 1, px: 1 }}> {/* Added padding for content within the box */}
                    {event.date && (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: '0.9rem' }}> {/* Adjusted font size */}
                        <strong>Date:</strong> {new Date(event.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                      </Typography>
                    )}
                    {event.location && (
                      <Typography variant="body2" color="text.secondary" sx={{ 
                        mb: 1, 
                        fontSize: '0.9rem',  // Adjusted font size
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        <strong>Location:</strong> {event.location}
                      </Typography>
                    )}
                    {typeof event.ticketPrice === 'number' && event.ticketPrice >= 0 && (
                      <Typography variant="h6" color="primary" sx={{ mt: 1, fontWeight: 'bold', fontSize: '1rem' }}> {/* Adjusted font size */}
                        ${event.ticketPrice.toFixed(2)}
                      </Typography>
                    )}
                  </Box>
                </CardContent>
                {/* CardActions removed as the whole card is clickable via RouterLink */}
              </Card>
            </RouterLink>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default FeaturedEvents;
