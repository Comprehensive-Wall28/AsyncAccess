import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { createEvent } from '../../services/eventService'; // Ensure this path is correct

export default function CreateEventForm() {
  const initialFormData = {
    title: '',
    description: '',
    date: '',
    location: '',
    category: '',
    image: '', // URL for the image
    ticketPrice: '',
    totalTickets: '',
  };
  const [formData, setFormData] = useState(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    // Basic validation for required fields (mirroring backend)
    const requiredFields = ['title', 'description', 'date', 'location', 'category', 'ticketPrice', 'totalTickets'];
    const missingFields = requiredFields.filter(field => !formData[field]);

    if (missingFields.length > 0) {
      setError(`Please fill in all required fields: ${missingFields.join(', ')}`);
      setIsLoading(false);
      return;
    }
    
    // Convert ticketPrice and totalTickets to numbers
    const payload = {
      ...formData,
      ticketPrice: Number(formData.ticketPrice),
      totalTickets: Number(formData.totalTickets),
    };

    try {
      const response = await createEvent(payload);
      setSuccessMessage(response.message || 'Event created successfully! It is pending approval.');
      setFormData(initialFormData); // Reset form
    } catch (err) {
      console.error("Event creation error:", err);
      if (err.data && err.data.message) {
        setError(err.data.message + (err.data.missingFields ? ` Missing: ${err.data.missingFields.join(', ')}` : ''));
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Failed to create event. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card sx={{ mt: 2, p: { xs: 2, sm: 3 }, width: '100%' }}>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3, textAlign: 'center' }}>
          Create New Event
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <Grid container spacing={2}> {/* Adjusted spacing */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <FormLabel htmlFor="title" sx={{ mb: 0.5, fontWeight: 'medium' }}>Event Title</FormLabel>
                <TextField
                  id="title"
                  name="title"
                  autoComplete="off"
                  value={formData.title}
                  onChange={handleChange}
                  disabled={isLoading}
                  variant="outlined"
                  placeholder="Enter event title"
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <FormLabel htmlFor="date" sx={{ mb: 0.5, fontWeight: 'medium' }}>Event Date and Time</FormLabel>
                <TextField
                  id="date"
                  name="date"
                  type="datetime-local"
                  InputLabelProps={{ shrink: true }} // Keep shrink true for datetime-local to show format
                  value={formData.date}
                  onChange={handleChange}
                  disabled={isLoading}
                  variant="outlined"
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <FormLabel htmlFor="description" sx={{ mb: 0.5, fontWeight: 'medium' }}>Event Description</FormLabel>
                <TextField
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  disabled={isLoading}
                  variant="outlined"
                  placeholder="Enter event description"
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <FormLabel htmlFor="location" sx={{ mb: 0.5, fontWeight: 'medium' }}>Location</FormLabel>
                <TextField
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  disabled={isLoading}
                  variant="outlined"
                  placeholder="Enter event location"
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <FormLabel htmlFor="category" sx={{ mb: 0.5, fontWeight: 'medium' }}>Category</FormLabel>
                <TextField
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  disabled={isLoading}
                  variant="outlined"
                  placeholder="e.g., Music, Workshop, Conference"
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth required>
                <FormLabel htmlFor="ticketPrice" sx={{ mb: 0.5, fontWeight: 'medium' }}>Ticket Price</FormLabel>
                <TextField
                  id="ticketPrice"
                  name="ticketPrice"
                  type="number"
                  InputProps={{ inputProps: { min: 0 } }}
                  value={formData.ticketPrice}
                  onChange={handleChange}
                  disabled={isLoading}
                  variant="outlined"
                  placeholder="e.g., 25"
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth required>
                <FormLabel htmlFor="totalTickets" sx={{ mb: 0.5, fontWeight: 'medium' }}>Total Tickets Available</FormLabel>
                <TextField
                  id="totalTickets"
                  name="totalTickets"
                  type="number"
                  InputProps={{ inputProps: { min: 1 } }}
                  value={formData.totalTickets}
                  onChange={handleChange}
                  disabled={isLoading}
                  variant="outlined"
                  placeholder="e.g., 100"
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <FormLabel htmlFor="image" sx={{ mb: 0.5, fontWeight: 'medium' }}>Image URL (Optional)</FormLabel>
                <TextField
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  disabled={isLoading}
                  variant="outlined"
                  placeholder="https://example.com/image.jpg"
                />
              </FormControl>
            </Grid>
          </Grid>
          {error && <Alert severity="error" sx={{ mt: 3 }}>{error}</Alert>}
          {successMessage && <Alert severity="success" sx={{ mt: 3 }}>{successMessage}</Alert>}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Create Event'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
