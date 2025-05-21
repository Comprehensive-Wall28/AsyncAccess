import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid'; // Import Grid
import Collapse from '@mui/material/Collapse'; // Import Collapse for animation
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import CancelIcon from '@mui/icons-material/Cancel'; // Optional: for the button icon
import IconButton from '@mui/material/IconButton'; // For the arrow button
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'; // Arrow icon

import * as eventsService from '../../services/eventService';

// Title component (similar to one in UserProfileDisplay or Title.tsx.preview)
const Title = (props) => (
    <Typography component="h2" variant="h6" color="primary" gutterBottom>
      {props.children}
    </Typography>
);

const getStatusColor = (status) => {
  if (!status) return 'default';
  switch (status.toLowerCase()) {
    case 'confirmed':
      return 'success';
    case 'cancelled':
      return 'error';
    case 'pending': // Assuming 'Pending' might be a status
      return 'warning';
    default:
      return 'default';
  }
};

export default function UserBookingsDisplay({ currentUser }) {
  const [events, setBookings] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [expandedBookings, setExpandedBookings] = React.useState({}); // State to manage expanded cards
  const [openCancelDialog, setOpenCancelDialog] = React.useState(false);
  const [eventToCancel, setBookingToCancel] = React.useState(null);
  const [cancelInProgress, setCancelInProgress] = React.useState(false);
  const [cancelError, setCancelError] = React.useState('');

  const handleToggleExpand = (eventId) => {
    // Correctly toggle the boolean state
    setExpandedBookings(prev => ({ ...prev, [eventId]: !prev[eventId] }));
  };

  const handleOpenCancelDialog = (event) => {
    setBookingToCancel(event);
    setOpenCancelDialog(true);
    setCancelError(''); // Clear previous errors
  };

  const handleCloseCancelDialog = () => {
    if (cancelInProgress) return; // Prevent closing while an operation is in progress
    setOpenCancelDialog(false);
    setBookingToCancel(null);
    setCancelError('');
  };

  const handleConfirmCancel = async () => {
    if (!eventToCancel) return;
    setCancelInProgress(true);
    setCancelError('');
    try {
      const result = await eventsService.cancelBookingById(eventToCancel._id);
      // Update the specific event in the local state
      setBookings(prevBookings =>
          prevBookings.map(b => b._id === eventToCancel._id ? result.event : b)
      );
      handleCloseCancelDialog();
      // Optionally: show a success snackbar/message
    } catch (err) {
      setCancelError(err.data?.error || err.message || 'Failed to cancel event.');
      // Keep dialog open to show error, or close and show snackbar
    } finally {
      setCancelInProgress(false);
    }
  };

  React.useEffect(() => {
    if (!currentUser) {
      setBookings([]);
      setIsLoading(false);
      setError(''); // Clear error if user logs out
      return;
    }

    const fetchUserBookings = async () => {
      setIsLoading(true);
      setError('');
      try {
        const data = await eventsService.getMyEvents();
        setBookings(data);
      } catch (err) {
        // The backend returns 404 with a specific error message for no events
        if (err && err.status === 404 && err.data && err.data.error === "No events found for this user") {
          setBookings([]); // This is an expected "empty" state
        } else if (err && err.data && err.data.error) { // Other errors from our backend
          setError(err.data.error);
          setBookings([]);
        } else if (err && err.message) { // Network errors or other generic errors
          setError(err.message);
          setBookings([]);
        } else {
          setError('An unexpected error occurred while fetching events.');
          setBookings([]);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserBookings();
  }, [currentUser]);

  if (!currentUser && !isLoading) {
    // Optionally, you could show a login prompt if you prefer,
    // but MainGrid might already handle overall auth state.
    // For now, it will just be an empty card if no currentUser.
    // Or, let's add a specific message for clarity:
    return (
        <Card sx={{ mt: 4, p: 2, width: '100%' }}>
          <CardContent>
            <Title>Your Bookings</Title>
            <Typography variant="subtitle1" color="text.secondary" textAlign="center" sx={{ py: 3 }}>
              Please log in to view your events.
            </Typography>
          </CardContent>
        </Card>
    );
  }

  return (
      <Card sx={{ mt: 4, p: 2, width: '100%' }}>
        <CardContent>
          <Title>Your Events</Title>
          {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100px' }}>
                <CircularProgress />
              </Box>
          ) : error ? (
              <Alert severity="error">{error}</Alert>
          ) : events.length === 0 ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100px' }}>
                <Typography variant="subtitle1" color="text.secondary">
                  You have no current events.
                </Typography>
              </Box>
          ) : (
              <Stack spacing={2} sx={{ mt: 2 }}>
                {events.map((event) => (
                    <Paper
                        key={event._id}
                        elevation={expandedBookings[event._id] ? 4 : 1}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          transition: (theme) => theme.transitions.create('box-shadow')
                        }}
                    >
                      <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                          sx={{ mb: expandedBookings[event._id] ? 1 : 0, cursor: 'pointer' }} // Add margin bottom and cursor
                          onClick={() => handleToggleExpand(event._id)} // Make the whole stack clickable
                      >
                        {/* Make the Typography and Chip clickable to toggle */}
                        <Typography variant="h6" component="div" noWrap sx={{ flexGrow: 1, pr: 1 }}>
                          {event.title
                              ? (event.title || '[No Title Provided]')
                              : 'Event Data Not Available'}
                        </Typography>
                        <Chip
                            label={event.status || 'N/A'}
                            color={getStatusColor(event.status)}
                            size="small"
                            sx={{ borderRadius: '8px', flexShrink: 0 }}
                        />
                        <IconButton
                            // onClick is now handled by the parent Stack
                            aria-expanded={expandedBookings[event._id]}
                            aria-label="show more"
                            size="small"
                            sx={{
                              ml: 1, // Margin left for spacing
                              transform: expandedBookings[event._id] ? 'rotate(180deg)' : 'rotate(0deg)',
                              transition: (theme) => theme.transitions.create('transform', {
                                duration: theme.transitions.duration.short,
                              }),
                            }}
                            disableRipple // Remove ripple effect from the icon button itself
                        >
                          <KeyboardArrowDownIcon />
                        </IconButton>
                      </Stack>
                      <Collapse in={expandedBookings[event._id]} timeout="auto" unmountOnExit>
                        <Box sx={{ pt: 2, borderTop: (theme) => `1px dashed ${theme.palette.divider}`, mt:1 }}> {/* Add padding top for the collapsed section */}
                          <Grid container spacing={1}>
                            {/* Tickets */}
                            <Grid item xs={4} sm={3}>
                              <Typography variant="body2" fontWeight="medium" color="text.secondary">Tickets:</Typography>
                            </Grid>
                            <Grid item xs={8} sm={9}>
                              <Typography variant="body2">{event.bookedTickets}</Typography>
                            </Grid>

                            {/* Event Date */}
                            <Grid item xs={4} sm={3}>
                              <Typography variant="body2" fontWeight="medium" color="text.secondary">Event Date:</Typography>
                            </Grid>
                            <Grid item xs={8} sm={9}>
                              <Typography variant="body2">
                                {(() => {
                                  if (event.date) {
                                    const date = new Date(event.date);
                                    if (!isNaN(date.valueOf())) { // Check if the date is valid
                                      return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
                                    }
                                  }
                                  return 'N/A';
                                })()}
                              </Typography>
                            </Grid>

                            <Grid item xs={4} sm={3}>
                              <Typography variant="body2" fontWeight="medium" color="text.secondary">Ticket Price:</Typography>
                            </Grid>
                            <Grid item xs={8} sm={9}>
                              <Typography variant="body2">${event.ticketPrice ? event.ticketPrice.toFixed(2) : 'N/A'}</Typography>
                            </Grid>

                            {/* Cancel Button - only if event is not already cancelled */}
                            {event.eventStatus && event.eventStatus.toLowerCase() !== 'cancelled' && (
                                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                                  {/* <Button
                            variant="contained"
                            color="error"
                            size="small"
                            startIcon={<CancelIcon />}
                            onClick={() => handleOpenCancelDialog(event)}
                            sx={{ borderRadius: '16px', textTransform: 'none' }}
                          >
                            Cancel Event
                          </Button> */}
                                </Grid>
                            )}
                          </Grid>
                        </Box>
                      </Collapse>
                    </Paper>
                ))}
              </Stack>
          )}
        </CardContent>
        {eventToCancel && (
            <Dialog
                open={openCancelDialog}
                onClose={handleCloseCancelDialog}
                aria-labelledby="cancel-event-dialog-title"
                aria-describedby="cancel-event-dialog-description"
            >
              <DialogTitle id="cancel-event-dialog-title">Confirm Cancellation</DialogTitle>
              <DialogContent>
                <DialogContentText id="cancel-event-dialog-description">
                  Are you sure you want to cancel your event for "{eventToCancel.event?.title || 'this event'}"?
                  This action cannot be undone.
                </DialogContentText>
                {cancelError && <Alert severity="error" sx={{ mt: 2 }}>{cancelError}</Alert>}
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseCancelDialog} disabled={cancelInProgress}>Back</Button>
                <Button onClick={handleConfirmCancel} color="error" autoFocus disabled={cancelInProgress}>
                  {cancelInProgress ? <CircularProgress size={24} color="inherit" /> : "Confirm Cancel"}
                </Button>
              </DialogActions>
            </Dialog>
        )}
      </Card>
  );
}