import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
// import { alpha } from '@mui/material/styles'; // alpha is not used, consider removing if not needed elsewhere
// import { ButtonBase } from '@mui/material'; // ButtonBase is not used, consider removing
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';

const API_URL = '/api/v1/events';

export default function Events() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setLoading(true);
                const response = await axios.get(API_URL);
                setEvents(response.data);
                setError(null);
            } catch (err) {
                console.error("Error fetching events:", err);
                setError(err.response?.data?.error || err.message || "Failed to fetch events. Please try again later.");
                setEvents([]);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" sx={{ py: 5, minHeight: '300px' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Container sx={{ py: 5 }}>
                <Alert severity="error" sx={{ justifyContent: 'center' }}>{error}</Alert>
            </Container>
        );
    }

    if (events.length === 0) {
        return (
            <Container sx={{ py: 5 }}>
                <Typography variant="h6" align="center">
                    No approved events found at the moment. Please check back later!
                </Typography>
            </Container>
        );
    }

    return (
        <Container sx={{ py: { xs: 1, sm: 4 } }} id="approved-events">
            <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mb: { xs: 5, sm: 3 } }}>
                {/* You can add a title here if needed, e.g., "Approved Events" */}
            </Typography>
            <Grid container spacing={0} rowSpacing={7}>
                {events.map((event) => (
                    <Grid item key={event._id} xs={12} sm={6} md={4}>
                        <Card sx={{
                            ml: 7.5,
                            width: '300px',
                            height: '250px',
                            display: 'flex',
                            flexDirection: 'column',
                            boxShadow: 3,
                            overflow: 'hidden',
                            transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out', // Added transition
                            '&:hover': {
                                boxShadow: 8, // Increased shadow intensity
                                transform: 'scale(1.03)', // Added scale transform
                            },
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
                                        WebkitLineClamp: '3',
                                        WebkitBoxOrient: 'vertical',
                                    }}
                                >
                                    {event.title}
                                </Typography>

                                <Box sx={{ pt: 1 }}>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: '1rem' }}>
                                        <strong>Date:</strong> {new Date(event.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: '1rem' }}>
                                        <strong>Location:</strong> {event.location}
                                    </Typography>
                                    {typeof event.ticketPrice === 'number' && event.ticketPrice >= 0 && (
                                        <Typography variant="h6" color="primary" sx={{ mt: 1, fontWeight: 'bold', fontSize: '1.1rem' }}>
                                            ${event.ticketPrice.toFixed(2)}
                                        </Typography>
                                    )}
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}