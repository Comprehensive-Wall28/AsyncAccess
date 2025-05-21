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
import IconButton from '@mui/material/IconButton'; // Import IconButton
import Menu from '@mui/material/Menu'; // Import Menu
import MenuItem from '@mui/material/MenuItem'; // Import MenuItem
import MoreVertIcon from '@mui/icons-material/MoreVert'; // Import MoreVertIcon (three dots)



import * as bookingsService from '../../services/bookingsService';

// Title component (similar to one in UserProfileDisplay or Title.tsx.preview)
const Title = (props) => (
  <Typography component="h2" variant="h6" color="inherit" gutterBottom>
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
  const [bookings, setBookings] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [showCancelled, setShowCancelled] = React.useState(true);
  const [expandedBookings, setExpandedBookings] = React.useState({}); // State to manage expanded cards
  const [openCancelDialog, setOpenCancelDialog] = React.useState(false);
  const [bookingToCancel, setBookingToCancel] = React.useState(null);
  const [cancelInProgress, setCancelInProgress] = React.useState(false);
  const [cancelError, setCancelError] = React.useState('');
  const [anchorEl, setAnchorEl] = React.useState(null); // Anchor for the menu

  const handleToggleExpand = (bookingId) => {
    // Correctly toggle the boolean state
    setExpandedBookings(prev => ({ ...prev, [bookingId]: !prev[bookingId] }));
  };

  const handleOpenCancelDialog = (booking) => {
    setBookingToCancel(booking);
    setOpenCancelDialog(true);
    setCancelError(''); // Clear previous errors
  };

  const handleMenuOpen = (event, booking) => {
    setBookingToCancel(booking); // Set the booking to cancel when menu opens
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setBookingToCancel(null); // Clear the booking when menu closes
  };

  const handleCancelFromMenu = () => {
    handleOpenCancelDialog(bookingToCancel); // Open the dialog using the existing function
  };
  
  const handleCloseCancelDialog = () => {
    if (cancelInProgress) return; // Prevent closing while an operation is in progress
    setOpenCancelDialog(false);
    setBookingToCancel(null);
    setCancelError('');
  };

  const handleConfirmCancel = async () => {
    if (!bookingToCancel) return;
    setCancelInProgress(true);
    setCancelError('');
    try {
      const result = await bookingsService.cancelBookingById(bookingToCancel._id);
      // Update the specific booking in the local state
      setBookings(prevBookings => 
        prevBookings.map(b => b._id === bookingToCancel._id ? result.booking : b)
      );
      handleCloseCancelDialog();
      // Optionally: show a success snackbar/message
    } catch (err) {
      setCancelError(err.data?.error || err.message || 'Failed to cancel booking.');
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
        const data = await bookingsService.getMyBookings();
        setBookings(data);
      } catch (err) {
        // The backend returns 404 with a specific error message for no bookings
        if (err && err.status === 404 && err.data && err.data.error === "No bookings found for this user") {
          setBookings([]); // This is an expected "empty" state
        } else if (err && err.data && err.data.error) { // Other errors from our backend
          setError(err.data.error);
          setBookings([]);
        } else if (err && err.message) { // Network errors or other generic errors
          setError(err.message);
          setBookings([]);
        } else {
          setError('An unexpected error occurred while fetching bookings.');
          setBookings([]);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserBookings();
  }, [currentUser]);

  if (!currentUser && !isLoading) {
     return (
        <Card sx={{ mt: 4, p: 2, width: '100%' }}>
            <CardContent>
                <Title>Your Bookings</Title>
                <Typography variant="subtitle1" color="text.secondary" textAlign="center" sx={{ py: 3 }}>
                    Please log in to view your bookings.
                </Typography>
            </CardContent>
        </Card>
    );
  }

  return (
    <Card sx={{ mt: 4, p: 2, width: '100%' }}>
      <CardContent>
        <Title>Your Bookings</Title>

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100px' }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : bookings.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100px' }}>
            <Typography variant="subtitle1" color="text.secondary">
              You have no current bookings.
            </Typography>
          </Box>
        ) : (
          <Stack spacing={2} sx={{ mt: 2 }}>
            {bookings
              .filter(booking => showCancelled || booking.bookingStatus !== 'Cancelled')
              .map((booking) => (


              <Card key={booking._id}>
                <Stack direction="row" alignItems="center" spacing={3} p={2} useFlexGap>
                  <Stack direction="column" spacing={0.5} useFlexGap sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="div">
                      {booking.event ? (booking.event.title || '[No Title Provided]') : 'Event Data Not Available'}
                    </Typography>
                    <Stack direction="row" spacing={1} useFlexGap>
                      <Chip
                        size="small"
                        label={booking.bookingStatus || 'N/A'}
                        color={getStatusColor(booking.bookingStatus)}
                      />
                      {/* You can add a rating component here if you have one, or remove this line */}
                    </Stack>                    
                  </Stack>                  
                  <div>
                    <IconButton
                      aria-label="more"
                      aria-controls={`booking-menu-${booking._id}`}
                      aria-haspopup="true"
                      onClick={(event) => handleMenuOpen(event, booking)}
                    >
                      {/* Use a smaller size for the MoreVertIcon */}
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                    <Menu
                      id={`booking-menu-${booking._id}`}
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl) && bookingToCancel?._id === booking._id}
                      onClose={handleMenuClose}
                    >
                    <MenuItem
                      onClick={handleCancelFromMenu}
                      disabled={cancelInProgress}
                    >
                      {cancelInProgress && bookingToCancel?._id === booking._id ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        "Cancel Booking"
                      )}
                      </MenuItem>
                      </Menu>
                    </div>
                  </Stack>
                <CardContent>
                  <Grid container spacing={2}>
                      {/* Tickets */}
                      <Grid  xs={6}>
                        <Typography variant="body2" fontWeight="medium" color="text.secondary">Tickets:</Typography>
                      </Grid>
                      <Grid  xs={6}>
                        <Typography variant="body2">{booking.numberOfTickets}</Typography>
                      </Grid>

                      {/* Event Date */}
                      {booking.event && booking.event.date && (
                        <>
                          <Grid item xs={6}>
                            <Typography variant="body2" fontWeight="medium" color="text.secondary">Event Date:</Typography>
                          </Grid>
                          <Grid item xs={8} sm={9}>
                            <Typography variant="body2">{new Date(booking.event.date).toLocaleDateString()}</Typography>
                          </Grid>
                        </>
                      )}

                      {/* Booking Date */}
                      <Grid item xs={6}>
                        <Typography variant="body2" fontWeight="medium" color="text.secondary">Booking Date:</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2">
                          {(() => {
                            if (booking.createdDate) {
                              const date = new Date(booking.createdDate);
                              if (!isNaN(date.valueOf())) { // Check if the date is valid
                                return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
                              }
                            }
                            return 'N/A';
                          })()}
                        </Typography>
                      </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}
      </CardContent>
      <Stack direction="row" justifyContent="flex-end" sx={{ mt: 2, p: 2 }}>
        <Button sx={{mx:"auto"}}
          variant="outlined"
          onClick={() => setShowCancelled(!showCancelled)}
          size="small" // Add this line to make the button smaller
        >
          {showCancelled ? "Hide Cancelled Bookings" : "Show Cancelled Bookings"}
        </Button>
      </Stack>











      {bookingToCancel && (
        <Dialog
          open={openCancelDialog}
          onClose={handleCloseCancelDialog}
          aria-labelledby="cancel-booking-dialog-title"
          aria-describedby="cancel-booking-dialog-description"
        >
          <DialogTitle id="cancel-booking-dialog-title">Confirm Cancellation</DialogTitle>
          <DialogContent>
            <DialogContentText id="cancel-booking-dialog-description">
              Are you sure you want to cancel your booking for "{bookingToCancel.event?.title || 'this event'}"?
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