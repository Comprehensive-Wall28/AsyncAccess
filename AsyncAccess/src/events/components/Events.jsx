import React, { useState, useEffect, useMemo } from 'react'; // Added useMemo
import axios from 'axios';
import { Link as RouterLink } from 'react-router-dom';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField'; // Added TextField for search
import SearchIcon from '@mui/icons-material/Search'; // Added SearchIcon
import InputAdornment from '@mui/material/InputAdornment'; // Added InputAdornment

const API_URL = '/api/v1/events';

export default function Events() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState(''); // State for the search term

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

    // Memoize the filtered events to avoid re-filtering on every render
    // unless events or searchTerm changes.
    const filteredEvents = useMemo(() => {
        if (!searchTerm) {
            return events;
        }
        return events.filter(event =>
            event.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [events, searchTerm]);

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

    return (
        <Container sx={{ py: { xs: 1, sm: 4 } }} id="approved-events">
            {/* Search Bar */}
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Enter event title..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                    sx={{ maxWidth: '600px' }} // Constrain the width of the search bar
                />
            </Box>

            {filteredEvents.length === 0 && !loading && (
                <Container sx={{ py: 5 }}>
                    <Typography variant="h6" align="center">
                        {searchTerm ? `No events found matching "${searchTerm}".` : "No approved events found at the moment. Please check back later!"}
                    </Typography>
                </Container>
            )}

            {filteredEvents.length > 0 && (
                <Grid container spacing={0} rowSpacing={7}>
                    {filteredEvents.map((event) => (
                        <Grid item key={event._id} xs={12} sm={6} md={4}>
                            <RouterLink to={`/events/${event._id}`} style={{ textDecoration: 'none', display: 'block' }}>
                                <Card sx={{
                                    ml: 7.5,
                                    width: '300px',
                                    height: '250px',
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
                            </RouterLink>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
}