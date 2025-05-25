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
    Paper,
    Divider,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';

// Imports for the overall page structure
import CssBaseline from '@mui/material/CssBaseline';
import AppTheme from '../../shared-theme/AppTheme';
import AppAppBar from '../../home-page/components/AppAppBar';
import Footer from '../../home-page/components/Footer';

// Import the backdrop image
import eventBackdrop from '../../assets/b.webp'; // Assuming assets folder is at src/assets

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
        // Scroll to top when id changes or component mounts
        window.scrollTo(0, 0);

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
                : Infinity; 

            navigate('/bookings', {
                state: {
                    eventId: event._id,
                    eventTitle: event.title,
                    ticketPrice: event.ticketPrice,
                    availableTickets: currentAvailableTickets,
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
            // This case should ideally be handled by the useEffect redirecting to /notfound
            // or show a specific "Event not found" message if preferred over redirect.
            // For now, keeping a loader as a fallback before redirect logic kicks in.
            return (
                <Container sx={{ py: 8, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                    <CircularProgress size={60} />
                </Container>
            );
        }

        const availableTickets = typeof event.totalTickets === 'number' && typeof event.bookedTickets === 'number'
            ? event.totalTickets - event.bookedTickets
            : 'N/A';
        
        const eventDate = new Date(event.date);

        const isButtonDisabled = availableTickets === 'N/A' || availableTickets <= 0;
        const buttonText = (availableTickets === 'N/A' || availableTickets > 0) ? 'Book Now' : 'Sold Out';

        const buttonSx = {
            py: 1.5, 
            px: 4, 
            fontSize: '1.1rem', 
            fontWeight: 'bold',
        };

        return (
            <Container maxWidth="md" sx={{ py: { xs: 3, sm: 5 } }}>
                {/* Image with Title Overlay */}
                <Box sx={{ position: 'relative', borderRadius: 3, overflow: 'hidden', mb: 4, boxShadow: 3 }}>
                    <Box
                        component="img"
                        src={eventBackdrop}
                        alt={event.title || "Event image"}
                        loading="eager" // Explicitly set loading strategy
                        sx={{
                            width: '100%',
                            height: { xs: 200, sm: 280, md: 350 }, // Reduced height
                            objectFit: 'cover',
                            display: 'block',
                        }}
                    />
                    <Box
                        sx={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            width: '100%',
                            p: {xs: 2, sm: 3},
                            background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)',
                        }}
                    >
                        <Typography variant="h3" component="h1" sx={{ color: 'white', fontWeight: 'bold' }}>
                            {event.title}
                        </Typography>
                    </Box>
                </Box>

                {/* Description */}
                <Typography 
                    variant="body1" 
                    paragraph 
                    sx={{ 
                        mb: 4, 
                        fontSize: '1.1rem', 
                        lineHeight: 1.7,
                        whiteSpace: 'pre-wrap', 
                        color: 'text.secondary' 
                    }}
                >
                    {event.description || "No detailed description available for this event."}
                </Typography>

                {/* Event Details Table */}
                <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 2, fontWeight: 'medium' }}>
                    Event Details
                </Typography>
                <Paper elevation={2} sx={{ mb: 4, borderRadius: 2, overflow: 'hidden' }}>
                    <TableContainer>
                        <Table aria-label="event details table">
                            <TableBody>
                                <TableRow>
                                    <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', width: { xs: '35%', sm: '25%' }, py: 1.5, borderBottom: 'none' }}>Date</TableCell>
                                    <TableCell sx={{ py: 1.5, borderBottom: 'none' }}>{eventDate.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', py: 1.5, borderBottom: 'none' }}>Time</TableCell>
                                    <TableCell sx={{ py: 1.5, borderBottom: 'none' }}>{eventDate.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: true })}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', py: 1.5, borderBottom: 'none' }}>Location</TableCell>
                                    <TableCell sx={{ py: 1.5, borderBottom: 'none' }}>{event.location}</TableCell>
                                </TableRow>
                                {event.category && event.category.length > 0 && (
                                    <TableRow>
                                        <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', verticalAlign: 'top', py: 1.5, borderBottom: 'none' }}>Categories</TableCell>
                                        <TableCell sx={{ py: 1.5, borderBottom: 'none' }}>
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                                {event.category.map((cat, index) => (
                                                    <Chip key={index} label={cat} size="small" variant="outlined" />
                                                ))}
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>

                {/* Booking Section */}
                <Paper elevation={3} sx={{ p: {xs: 2, sm: 3}, borderRadius: 2, textAlign: 'center', backgroundColor: 'primary.lightest', mb: 4 }}>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 'medium', color: 'primary.dark' }}>
                        Tickets
                    </Typography>
                    <Typography variant="h4" color="primary.main" sx={{ fontWeight: 'bold', mb: 1 }}>
                        ${event.ticketPrice.toFixed(2)}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2, color: 'text.secondary' }}>
                        Available: {availableTickets === 'N/A' ? 'N/A' : (availableTickets > 0 ? availableTickets : 'None')}
                    </Typography>
                    <Button
                        variant="outlined" // Always outlined
                        color={isButtonDisabled ? "inherit" : "primary"} // Adjust color based on disabled state
                        size="large"
                        startIcon={<ConfirmationNumberIcon />}
                        onClick={handleBookNowClick}
                        disabled={isButtonDisabled}
                        sx={buttonSx} // Use the simplified sx
                    >
                        {buttonText}
                    </Button>
                </Paper>
                
                <Box sx={{ mt: 4, textAlign: 'center' }}>
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate('/events')}
                    >
                        Back to All Events
                    </Button>
                </Box>
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
                        'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 90%), transparent)', // Light mode
                    ...theme.applyStyles('dark', {
                        backgroundImage:
                            'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 16%), transparent)', // Dark mode
                    }),
                    minHeight: 'calc(100vh - 64px)', // Adjust if AppAppBar height changes
                    pt: '64px', // Offset for AppAppBar
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