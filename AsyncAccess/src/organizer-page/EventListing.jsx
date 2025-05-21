import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import NotFound from '../components/NotFoundComponent';
import { FaMapMarkerAlt, FaCalendarAlt, FaClock } from 'react-icons/fa';
import { apiClient } from "../services/authService.js";
import { Box, Stack, Typography, Alert, Paper, CssBaseline } from '@mui/material';

function EventListing() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const userRole = user?.role ?? null;
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.get('/users/profile');
        setCurrentUser(response.data);

        if (response.data.role === 'User') {
          setNotFound(true);
          return;
        }

        const eventsResponse = await fetch('http://localhost:3000/api/v1/users/events', {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        });

        if (!eventsResponse.ok) {
          setError('Events not found');
          setLoading(false);
          return;
        }

        const data = await eventsResponse.json();
        setEvents(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user.role, userRole]);

  if (notFound) {
    return <NotFound />;
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', p: 3 }}>
      <CssBaseline enableColorScheme />
      <Typography variant="h3" align="center" sx={{ mb: 4 }}>
        Organizer Dashboard
      </Typography>
      <Box>
        <Typography variant="h5" gutterBottom>
          All Events
        </Typography>
        {loading ? (
          <Alert severity="info">Loading events...</Alert>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : events.length === 0 ? (
          <Alert severity="warning">No events available</Alert>
        ) : (
          <Stack spacing={2}>
            {events.map((event) => (
              <Paper key={event._id} sx={{ p: 2 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Typography variant="h6">{event.title || 'Untitled Event'}</Typography>
                  <Typography variant="caption" color="primary" sx={{ ml: 1 }}>
                    {event.status}
                  </Typography>
                  {event.category && (
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                      {event.category}
                    </Typography>
                  )}
                </Stack>
                <Stack direction="row" spacing={3} mt={1}>
                  {event.date && (
                    <span><FaCalendarAlt /> {new Date(event.date).toLocaleDateString()}</span>
                  )}
                  {event.time && (
                    <span><FaClock /> {event.time}</span>
                  )}
                  {event.location && (
                    <span><FaMapMarkerAlt /> {event.location}</span>
                  )}
                </Stack>
              </Paper>
            ))}
          </Stack>
        )}
      </Box>
      <Outlet />
    </Box>
  );
}

export default EventListing;