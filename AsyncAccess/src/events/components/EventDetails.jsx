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
import BusinessIcon from '@mui/icons-material/Business'; // For Organizer
// import StyleIcon from '@mui/icons-material/Style'; // For Tags - Replaced by CategoryIcon for multiple categories
import PeopleIcon from '@mui/icons-material/People'; // For Capacity/Total Tickets
import BookOnlineIcon from '@mui/icons-material/BookOnline'; // For Booked Tickets

// Imports for the overall page structure
import CssBaseline from '@mui/material/CssBaseline';
import AppTheme from '../../shared-theme/AppTheme';
import AppAppBar from './AppAppBar';
import Footer from './Footer';

const API_URL = '/api/v1/events';

const EventDetails = (props) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEvent = async () => {
            setLoading(true);
            try {
                // Ensure your API populates the organizer field if you want to display its details
                const response = await axios.get(`${API_URL}/${id}`);
                setEvent(response.data);
                setError(null);
            } catch (err) { // Corrected line: Removed "MuiInputLabel-shrink" and added opening brace
                console.error("Error fetching event:", err);
                setError(err.response?.data?.error || err.message || "Failed to fetch event details.");
                setEvent(null);
            } finally { // Added closing brace for catch block
                setLoading(false);
            }
        };

        fetchEvent();
    }, [id]);

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
                <Container sx={{ py: 5, textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography variant="h5" gutterBottom>
                        Event Not Found
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                        The event you are looking for does not exist or may have been removed.
                    </Typography>
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

        const availableTickets = typeof event.totalTickets === 'number' && typeof event.bookedTickets === 'number'
            ? event.totalTickets - event.bookedTickets
            : 'N/A';

        // Main event details content
        return (
            <Container maxWidth="lg" sx={{ py: { xs: 3, sm: 5 }, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                <Paper
                    sx={{
                        borderRadius: 4,
                        overflow: 'hidden',
                        width: '60%',
                        maxWidth: '900px',
                        boxShadow: '0px 0px 20px 10px rgb(72, 111, 220)',
                        mt: 10,// Add top margin
                        backgroundColor: 'background.paper', // Ensure paper has a background
                        zIndex: 1, // Ensure paper is above the main box background
                    }}
                >
                    <Box sx={{
                        p: { xs: 2, sm: 3, md: 4 },
                        textAlign: 'center' // Center all text inside the box by default
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
                            <Grid item xs={12} md={7}>
                                <Stack spacing={2}>
                                    {/* Date & Time */}
                                    <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}> {/* Changed p:1 to p:2 */}
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

                                    {/* Location */}
                                    <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}> {/* Changed p:1 to p:2 */}
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <LocationOnIcon color="action" sx={{ mr: 1.5 }} />
                                            <Box sx={{ textAlign: 'left' }}>
                                                <Typography variant="overline" color="text.secondary" display="block">
                                                    LOCATION
                                                </Typography>
                                                <Typography variant="h6" component="p">
                                                    {event.location}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Paper>

                                    {/* Categories */}
                                    {event.category && event.category.length > 0 && (
                                        <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}> {/* Changed p:1 to p:2 */}
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

                                    {/* Organizer */}
                                    {event.organizer && (
                                        <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}> {/* Changed p:1 to p:2 */}
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <BusinessIcon color="action" sx={{ mr: 1.5 }} />
                                                <Box sx={{ textAlign: 'left' }}>
                                                    <Typography variant="overline" color="text.secondary" display="block">
                                                        ORGANIZER
                                                    </Typography>
                                                    <Typography variant="body1" component="p">
                                                        {typeof event.organizer === 'object' ? event.organizer.name || 'N/A' : event.organizer}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Paper>
                                    )}
                                </Stack>
                            </Grid>

                            <Grid item xs={12} md={5}>
                                <Stack spacing={2}>
                                    {/* Ticket Price */}
                                    <Paper elevation={2} sx={{ p: 2, borderRadius: 2, textAlign: 'center' }}> {/* Changed p:1 to p:2 */}
                                        <Box>
                                            <Typography variant="overline" color="text.secondary">
                                                TICKET PRICE
                                            </Typography>
                                            <Typography variant="h3" color="primary">
                                                ${event.ticketPrice.toFixed(2)}
                                            </Typography>
                                        </Box>
                                    </Paper>

                                    {/* Total Tickets */}
                                    <Paper elevation={2} sx={{ p: 2, borderRadius: 2, textAlign: 'center' }}> {/* Changed p:1 to p:2 */}
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <PeopleIcon color="action" sx={{ mr: 1 }} />
                                            <Box>
                                                <Typography variant="overline" color="text.secondary">
                                                    TOTAL TICKETS: {event.totalTickets}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Paper>

                                    {/* Booked Tickets */}
                                    <Paper elevation={2} sx={{ p: 2, borderRadius: 2, textAlign: 'center' }}> {/* Kept p:2 */}
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <BookOnlineIcon color="action" sx={{ mr: 1 }} />
                                            <Box>
                                                <Typography variant="overline" color="text.secondary">
                                                    BOOKED TICKETS: {event.bookedTickets}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Paper>

                                    {/* Available Tickets */}
                                    <Paper elevation={2} sx={{ p: 2, borderRadius: 2, textAlign: 'center' }}> {/* Kept p:2 */}
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <ConfirmationNumberIcon color="action" sx={{ mr: 1 }} />
                                            <Box>
                                                <Typography variant="overline" color="text.secondary">
                                                    AVAILABLE: {availableTickets}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Paper>

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
                                            mt: 2,
                                            alignSelf: 'center' // Center the button
                                        }}
                                        onClick={() => alert('Booking functionality to be implemented!')}
                                        disabled={availableTickets <= 0}
                                    >
                                        {availableTickets > 0 ? 'Book Now' : 'Sold Out'}
                                    </Button>
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
                sx={(theme) => ({ // Added theme argument to access theme.applyStyles
                    flexGrow: 1,
                    width: '100%', // Ensure the box takes full width for the background
                    backgroundRepeat: 'no-repeat',
                    backgroundImage:
                        'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 90%), transparent)', // Light mode gradient
                    ...theme.applyStyles('dark', { // Dark mode gradient
                        backgroundImage:
                            'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 16%), transparent)',
                    }),
                    // Add some padding top to account for the AppAppBar, similar to Hero's container
                    // pt: { xs: 'calc(var(--template-frame-height, 0px) + 28px + 56px + 20px)', md: 'calc(var(--template-frame-height, 0px) + 28px + 64px + 40px)' },
                    // The content itself (Paper) has mt: 10, so direct pt on main box might not be needed or could be simpler
                    minHeight: '100vh', // Ensure background covers the whole viewport height
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