import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, Card, CardContent, Grid, CircularProgress, Alert } from '@mui/material';

function OrganizerDashboard() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function init() {
            try {
                const irl = "http://localhost:3000/api/v1/users/profile"
                // Check authentication first
                await axios.get(irl, { withCredentials: true });
                // If authenticated, fetch events
                const eventsRes = await axios.get('http://localhost:3000/api/v1/events', { withCredentials: true });
                setEvents(Array.isArray(eventsRes.data) ? eventsRes.data : []);
            } catch (err) {
                if (err.response) {
                    setError(`API error: ${err.response.status} ${err.response.data?.message || ''}`);
                } else if (err.request) {
                    setError('request error') //show user
                    //setError('No response received from server.');
                } else {
                    setError(`Error: ${err.message}`);
                }
            } finally {
                setLoading(false);
            }
        }
        init();
    }, []);

    if (loading) return <Container sx={{ mt: 4 }}><CircularProgress /></Container>;
    if (error) return <Container sx={{ mt: 4 }}><Alert severity="error">{error}</Alert></Container>;

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>Organizer Dashboard</Typography>
            <Typography variant="subtitle1" gutterBottom>Welcome to the organizer management page.</Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>My Events</Typography>
                    {events.length > 0 ? events.map(event => (
                        <Card key={event._id || event.id} sx={{ mb: 2 }}>
                            <CardContent>
                                <Typography variant="subtitle1">{event.title}</Typography>
                                <Typography color="text.secondary">{event.status}</Typography>
                            </CardContent>
                        </Card>
                    )) : <Typography>No events found.</Typography>}
                </Grid>
            </Grid>
        </Container>
    );
}

export default OrganizerDashboard;