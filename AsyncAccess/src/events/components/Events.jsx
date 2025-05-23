import React, { useState, useEffect, useMemo } from 'react';
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
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel'; // Keep InputLabel
import Stack from '@mui/material/Stack';

const BACKEND_STATIC_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const apiClientInstance = axios.create({
  baseURL: BACKEND_STATIC_BASE_URL,
  withCredentials: true,
});

export default function Events() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setLoading(true);
                setError(null); // Reset error state at the beginning
                const response = await apiClientInstance.get('/events/');

        
                const eventsData = Array.isArray(response.data) ? response.data : [];
                setEvents(eventsData);

                // Only attempt to reduce if eventsData is not empty
                if (eventsData.length > 0) {
                    const allCategories = eventsData.reduce((acc, event) => {
                        if (event.category && Array.isArray(event.category)) {
                            event.category.forEach(cat => {
                                if (cat && !acc.includes(cat)) {
                                    acc.push(cat);
                                }
                            });
                        }
                        return acc;
                    }, []);
                    setCategories(['All Categories', ...allCategories.sort()]);
                } else {
                  
                    setCategories(['All Categories']);
                    if (!Array.isArray(response.data) && response.data != null) {
                        // Log if response.data was received but wasn't an array
                        console.warn("Received non-array data for events:", response.data);
                    }
                }

            } catch (err) {
                console.error("Error fetching events:", err);
                const message = err.response?.data?.error || err.response?.data?.message || err.message || "Failed to fetch events. Please try again later.";
                setError(message);
                setEvents([]); // Ensure events is an empty array on error
                setCategories(['All Categories']); // Reset categories on error
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    const filteredEvents = useMemo(() => {
        return events.filter(event => {
            const titleMatch = event.title.toLowerCase().includes(searchTerm.toLowerCase());
            const categoryMatch = selectedCategory === '' || selectedCategory === 'All Categories'
                ? true
                : event.category && event.category.includes(selectedCategory);
            return titleMatch && categoryMatch;
        });
    }, [events, searchTerm, selectedCategory]);

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
            {/* Search and Filter Controls */}
            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                sx={{ mb: 4, justifyContent: 'center', alignItems: 'center' }}
            >
                <TextField
                    variant="outlined"
                    placeholder="Search by title..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                    sx={{ width: { xs: '100%', sm: 'auto' }, minWidth: { sm: '300px' }, flexGrow: { sm: 1 }, maxWidth: {sm: '500px'} }}
                />
                <FormControl variant="outlined" sx={{ width: { xs: '100%', sm: 'auto' }, minWidth: { sm: '200px' } }}>
                    {/* MODIFIED InputLabel below */}
                    <InputLabel
                        id="category-filter-label"
                        // Add sx prop to the InputLabel
                        sx={{
                            // Style for the default (not shrunken) state
                            // Adjust the second value (vertical translation) to move it up/down inside the box
                            // Default is often around 16px for standard size. Decrease to move up.
                            transform: 'translate(69px, 10px) scale(1)', // Example: moved up from default 16px to 14px

                            // Style for the shrunken (floated above) state (from previous request)
                            '&.MuiInputLabel-shrink': {
                                transform: 'translate(5px, -18px) scale(0.75)',
                            },
                        }}
                    >
                        Category
                    </InputLabel>
                    <Select
                        labelId="category-filter-label"
                        id="category-filter"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        label="Category" // This is important for the InputLabel to work correctly
                    >
                        {categories.map((category) => (
                            <MenuItem key={category} value={category === 'All Categories' ? '' : category}>
                                {category}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Stack>

            {filteredEvents.length === 0 && !loading && (
                <Container sx={{ py: 5 }}>
                    <Typography variant="h6" align="center">
                        {searchTerm || (selectedCategory && selectedCategory !== 'All Categories')
                            ? `No events found matching your criteria.`
                            : "No approved events found at the moment. Please check back later!"}
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
