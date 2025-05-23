import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Container,
    Box,
    Typography,
    Button,
    CircularProgress,
    Alert,
    Stack,
    Grid,
    Paper,
    Divider,
    Chip,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EventIcon from '@mui/icons-material/Event';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CategoryIcon from '@mui/icons-material/Category';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';

// Imports for the overall page structure
import CssBaseline from '@mui/material/CssBaseline';
import AppTheme from '../../shared-theme/AppTheme';
import AppAppBar from '../../home-page/components/AppAppBar';
import Footer from '../../home-page/components/Footer';

const BACKEND_STATIC_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const apiClientInstance = axios.create({
    baseURL: BACKEND_STATIC_BASE_URL,
    withCredentials: true,
});

const EventDetails = (props) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) {
            setLoading(false);
            return;
        }

        const fetchEvent = async () => {
            setLoading(true);
            setError(null);
            setEvent(null);
            try {
                const response = await apiClientInstance.get(`/events/${id}`);
                if (response.data && Object.keys(response.data).length > 0) {
                    setEvent(response.data);
                }
            } catch (err) {
                console.error("Error fetching event:", err);
                if (err.response && err.response.status === 404) {
                    // Handled by the redirect useEffect
                } else {
                    setError(err.response?.data?.error || err.message || "Failed to fetch event details.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [id]);

    useEffect(() => {
        if (!loading && !event && !error) {
            navigate('/notfound', { replace: true });
        }
    }, [loading, event, error, navigate]);

    const handleBookNowClick = () => {
        if (event) {
            const currentAvailableTickets = (typeof event.totalTickets === 'number' && typeof event.bookedTickets === 'number')
                ? event.totalTickets - event.bookedTickets
                : Infinity; // Default to Infinity if data is missing, though UI should prevent this

            navigate('/bookings', {
                state: {
                    eventId: event._id,
                    eventTitle: event.title,
                    ticketPrice: event.ticketPrice,
                    availableTickets: currentAvailableTickets, // Pass available tickets
                }
            });
        } else {
            console.error("Cannot proceed to booking, event data is not available.");
        }
    };

    const renderPageContent = () => {
        if (loading) {
            return (
                <Container sx={{ py: 8, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                    <CircularProgress size={60} />
                </Container>
            );
        }

        if (error) {
            return (
                <Container sx={{ py: 5, textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <Alert severity="error" sx={{ mb: 3, justifyContent: 'center', width: 'fit-content' }}>{error}</Alert>
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate('/events')}
                    >
                        Back to Events
                    </Button>
                </Container>
            );
        }

        if (!event) {
            return (
                <Container sx={{ py: 8, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                    <CircularProgress size={60} />
                </Container>
            );
        }

        const availableTickets = typeof event.totalTickets === 'number' && typeof event.bookedTickets === 'number'
            ? event.totalTickets - event.bookedTickets
            : 'N/A';

        return (
            <Container maxWidth="lg" sx={{ py: { xs: 3, sm: 5 }, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Paper
                    sx={{
                        borderRadius: 4,
                        overflow: 'hidden',
                        width: '60%',
                        maxWidth: '900px',
                        boxShadow: '0px 0px 20px 10px rgb(72, 111, 220)',
                        mt: 10,
                        backgroundColor: 'background.paper',
                        zIndex: 1,
                    }}
                >
                    <Box sx={{
                        p: { xs: 2, sm: 3, md: 4 },
                        textAlign: 'center'
                    }}>
                        <Typography
                            variant="h1"
                            component="h1"
                            gutterBottom
                            sx={{
                                fontWeight: 'bold',
                                color: 'primary.main',
                                mb: 1,
                            }}
                        >
                            {event.title}
                        </Typography>

                        <Typography
                            variant="body1"
                            color="text.secondary"
                            paragraph
                            sx={{
                                mb: 3,
                                fontSize: '1.1rem',
                                whiteSpace: 'pre-wrap',
                            }}
                        >
                            {event.description || "No detailed description available for this event."}
                        </Typography>

                        <Divider sx={{ my: 3 }} />

                        <Grid container spacing={3} justifyContent="center">
                            <Grid item xs={12} md={7} sx={{ display: 'flex', flexDirection: 'column' }}>
                                <Stack spacing={2} sx={{ flexGrow: 1 }}>
                                    <Paper
                                        elevation={2}
                                        sx={{
                                            p: 2,
                                            borderRadius: 2,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            flexGrow: 1,
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <EventIcon color="action" sx={{ mr: 1.5 }} />
                                            <Box sx={{ textAlign: 'left' }}>
                                                <Typography variant="overline" color="text.secondary" display="block">
                                                    DATE & TIME
                                                </Typography>
                                                <Typography variant="h6" component="p">
                                                    {new Date(event.date).toLocaleDateString(undefined, {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Paper>

                                    <Paper
                                        elevation={2}
                                        sx={{
                                            p: 2,
                                            borderRadius: 2,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            flexGrow: 1,
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <LocationOnIcon color="action" sx={{ mr: 1.5 }} />
                                            <Box sx={{ textAlign: 'left' }}>
                                                <Typography variant="overline" color="text.secondary" display="block">
                                                    Location
                                                </Typography>
                                                <Typography variant="h6" component="p">
                                                    {event.location}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Paper>

                                    {event.category && event.category.length > 0 && (
                                        <Paper
                                            elevation={2}
                                            sx={{
                                                p: 2,
                                                borderRadius: 2,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'center',
                                                flexGrow: 1,
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                                                <CategoryIcon color="action" sx={{ mr: 1.5, mt: 0.5 }} />
                                                <Box sx={{ textAlign: 'left' }}>
                                                    <Typography variant="overline" color="text.secondary" display="block">
                                                        CATEGORIES
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'flex-start' }}>
                                                        {event.category.map((cat, index) => (
                                                            <Chip key={index} label={cat} size="small" variant="outlined" />
                                                        ))}
                                                    </Box>
                                                </Box>
                                            </Box>
                                        </Paper>
                                    )}
                                </Stack>
                            </Grid>

                            <Grid item xs={12} md={5} sx={{ display: 'flex', flexDirection: 'column' }}>
                                <Stack spacing={2} sx={{ flexGrow: 1 }}>
                                    <Paper
                                        elevation={2}
                                        sx={{
                                            p: 2,
                                            borderRadius: 2,
                                            textAlign: 'center',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            flexGrow: 1,
                                        }}
                                    >
                                        <Box>
                                            <Typography variant="overline" color="text.secondary">
                                                TICKET PRICE
                                            </Typography>
                                            <Typography variant="h3" color="primary">
                                                ${event.ticketPrice.toFixed(2)}
                                            </Typography>
                                        </Box>
                                    </Paper>

                                    <Paper
                                        elevation={2}
                                        sx={{
                                            p: 2,
                                            borderRadius: 2,
                                            textAlign: 'center',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            flexGrow: 1,
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <ConfirmationNumberIcon color="action" sx={{ mr: 1 }} />
                                            <Box>
                                                <Typography variant="overline" color="text.secondary">
                                                    AVAILABLE: {availableTickets}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Paper>

                                    <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            size="large"
                                            startIcon={<ConfirmationNumberIcon />}
                                            sx={{
                                                py: 1.5,
                                                px: 4,
                                                fontSize: '1.1rem',
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                            }}
                                            onClick={handleBookNowClick}
                                            disabled={availableTickets === 'N/A' || availableTickets <= 0}
                                        >
                                            {availableTickets === 'N/A' || availableTickets > 0 ? 'Book Now' : 'Sold Out'}
                                        </Button>
                                    </Box>
                                </Stack>
                            </Grid>
                        </Grid>
                    </Box>
                </Paper>
            </Container>
        );
    };

    return (
        <AppTheme {...props}>
            <CssBaseline enableColorScheme />
            <AppAppBar />
            <Box
                component="main"
                sx={(theme) => ({
                    flexGrow: 1,
                    width: '100%',
                    backgroundRepeat: 'no-repeat',
                    backgroundImage:
                        'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 90%), transparent)',
                    ...theme.applyStyles('dark', {
                        backgroundImage:
                            'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 16%), transparent)',
                    }),
                    minHeight: '100vh',
                })}
            >
                {renderPageContent()}
            </Box>
            <div>
                <Divider sx={{ mt: { xs: 4, sm: 8 }, mb: { xs: 2, sm: 4 } }} />
                <Footer />
            </div>
        </AppTheme>
    );
};

export default EventDetails;