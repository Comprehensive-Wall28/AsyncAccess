import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import TextField from '@mui/material/TextField'; // Added TextField

import * as eventsService from '../../services/eventService';

// Title component
const Title = (props) => (
    <Typography component="h2" variant="h6" color="inherit" gutterBottom> {/* Changed color to inherit */}
      {props.children}
    </Typography>
);

const getStatusColor = (status) => {
  if (!status) return 'default';
  switch (status.toLowerCase()) {
    case 'approved': // Common status for organizer events
    case 'live':
    case 'confirmed': // Kept for consistency if used
      return 'success';
    case 'cancelled':
      return 'error';
    case 'pending approval': // Common status for organizer events
    case 'pending':
      return 'warning';
    case 'rejected':
    case 'draft':
      return 'default'; // Or another appropriate color
    default:
      return 'default';
  }
};

const formatStatusDisplay = (status) => {
  if (!status) return 'N/A';
  return status
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export default function UserEventsDisplay({ currentUser }) {
  const [events, setEvents] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [showCancelled, setShowCancelled] = React.useState(false); // Added
  const [anchorEl, setAnchorEl] = React.useState(null); // Added for menu
  const [eventActionTarget, setEventActionTarget] = React.useState(null); // Added for menu context

  // State for Delete Dialog
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [eventToDelete, setEventToDelete] = React.useState(null);
  const [deleteInProgress, setDeleteInProgress] = React.useState(false);
  const [deleteError, setDeleteError] = React.useState('');

  // State for Edit Dialog
  const [openEditDialog, setOpenEditDialog] = React.useState(false);
  const [eventToEdit, setEventToEdit] = React.useState(null);
  const [editFormData, setEditFormData] = React.useState({
    location: '',
    totalTickets: '',
    date: '',
  });
  const [editInProgress, setEditInProgress] = React.useState(false);
  const [editError, setEditError] = React.useState('');


  const handleMenuOpen = (event, eventData) => { // Added
    setEventActionTarget(eventData);
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => { // Added
    setAnchorEl(null);
    setEventActionTarget(null);
  };

  // Handlers for Delete Dialog
  const handleOpenDeleteDialog = (eventData) => {
    setEventToDelete(eventData);
    setOpenDeleteDialog(true);
    setDeleteError('');
    handleMenuClose(); // Close menu when dialog opens
  };

  const handleCloseDeleteDialog = () => {
    if (deleteInProgress) return;
    setOpenDeleteDialog(false);
    setEventToDelete(null);
    setDeleteError('');
  };

  const handleConfirmDelete = async () => {
    if (!eventToDelete) return;
    setDeleteInProgress(true);
    setDeleteError('');
    try {
      await eventsService.deleteEventById(eventToDelete._id);
      setEvents(prevEvents => prevEvents.filter(e => e._id !== eventToDelete._id));
      handleCloseDeleteDialog();
    } catch (err) {
      setDeleteError(err.data?.error || err.message || 'Failed to delete event.');
    } finally {
      setDeleteInProgress(false);
    }
  };

  // Handlers for Edit Dialog
  const handleOpenEditDialog = (eventData) => {
    setEventToEdit(eventData);
    // Format date for datetime-local input: YYYY-MM-DDTHH:mm
    const localDateTime = eventData.date ? new Date(new Date(eventData.date).getTime() - (new Date(eventData.date).getTimezoneOffset() * 60000)).toISOString().slice(0, 16) : '';
    setEditFormData({
      location: eventData.location || '',
      totalTickets: eventData.totalTickets !== undefined ? String(eventData.totalTickets) : '',
      date: localDateTime,
    });
    setOpenEditDialog(true);
    setEditError('');
    handleMenuClose();
  };

  const handleCloseEditDialog = () => {
    if (editInProgress) return;
    setOpenEditDialog(false);
    setEventToEdit(null);
    setEditError('');
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleConfirmEdit = async () => {
    if (!eventToEdit) return;
    setEditInProgress(true);
    setEditError('');

    const dataToUpdate = {
      location: editFormData.location,
      // Ensure totalTickets is a number or undefined if empty, not NaN
      totalTickets: editFormData.totalTickets === '' ? undefined : parseInt(editFormData.totalTickets, 10),
      date: editFormData.date ? new Date(editFormData.date).toISOString() : undefined,
    };

    // Filter out undefined or NaN fields
    Object.keys(dataToUpdate).forEach(key => {
      if (dataToUpdate[key] === undefined || (key === 'totalTickets' && isNaN(dataToUpdate[key]))) {
        // If totalTickets was explicitly set to empty string, it became undefined.
        // If it was non-numeric, it became NaN. In these cases, don't send the field.
        // However, allow 0 for totalTickets.
        if (key === 'totalTickets' && dataToUpdate[key] !== 0) {
            delete dataToUpdate[key];
        } else if (key !== 'totalTickets') {
            delete dataToUpdate[key];
        }
      }
    });


    try {
      const result = await eventsService.updateEventById(eventToEdit._id, dataToUpdate);
      setEvents(prevEvents =>
        prevEvents.map(e => (e._id === eventToEdit._id ? { ...e, ...result.data.event } : e))
      );
      handleCloseEditDialog();
    } catch (err) {
      setEditError(err.data?.error || err.data?.message || err.message || 'Failed to update event.');
    } finally {
      setEditInProgress(false);
    }
  };


  React.useEffect(() => {
    if (!currentUser) {
      setEvents([]);
      setIsLoading(false);
      setError('');
      return;
    }

    const fetchUserEvents = async () => { // Renamed from fetchUserBookings
      setIsLoading(true);
      setError('');
      try {
        // Assuming getMyEvents fetches events created by the organizer
        const data = await eventsService.getMyEvents();
        setEvents(data);
      } catch (err) {
        if (err && err.status === 404 && err.data && err.data.error === "No events found for this user") {
          setEvents([]);
          setError("No events found"); // Set specific message for this case
        } else if (err && err.data && err.data.error) {
          setError(err.data.error);
          setEvents([]);
        } else if (err && err.message) {
          setError(err.message);
          setEvents([]);
        } else {
          setError('An unexpected error occurred while fetching events.');
          setEvents([]);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserEvents();
  }, [currentUser]);

  if (!currentUser && !isLoading) {
    return (
        <Card sx={{ mt: 4, p: 2, width: '100%' }}>
          <CardContent>
            <Title>Your Created Events</Title>
            <Typography variant="subtitle1" color="text.secondary" textAlign="center" sx={{ py: 3 }}>
              Please log in to view your created events.
            </Typography>
          </CardContent>
        </Card>
    );
  }

  const filteredEvents = events.filter(event => showCancelled || (event.status && event.status.toLowerCase() !== 'cancelled'));

  return (
      <Card sx={{ mt: 4, p: 2, width: '100%' }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Title>Your Created Events</Title>
            <Button
              variant="outlined"
              onClick={() => setShowCancelled(!showCancelled)}
              size="small"
            >
              {showCancelled ? "Hide Cancelled" : "Show Cancelled"}
            </Button>
          </Box>

          {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100px' }}>
                <CircularProgress />
              </Box>
          ) : error ? (
              <Alert severity="error">{error}</Alert>
          ) : filteredEvents.length === 0 ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100px' }}>
                <Typography variant="subtitle1" color="text.secondary">
                  {showCancelled && events.length > 0 ? "No cancelled events to show." : "You have not created any events yet."}
                </Typography>
              </Box>
          ) : (
              <Stack spacing={2} sx={{ mt: 2 }}>
                {filteredEvents.map((event) => (
                    <Card key={event._id}> {/* Removed elevation={2} */}
                      <Stack direction="row" alignItems="center" spacing={3} p={2} useFlexGap> {/* Changed spacing to 3 */}
                        <Stack direction="column" spacing={0.5} useFlexGap sx={{ flexGrow: 1 }}>
                          <Typography variant="h6" component="div" noWrap>
                            {event.title || '[No Title Provided]'}
                          </Typography>
                          <Stack direction="row" spacing={1} useFlexGap alignItems="center">
                            <Chip
                                label={formatStatusDisplay(event.status)} // Used formatStatusDisplay
                                color={getStatusColor(event.status)}
                                size="small"
                            />
                            <Typography variant="caption" color="text.secondary">
                              {new Date(event.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                            </Typography>
                          </Stack>
                        </Stack>
                        {event.status && event.status.toLowerCase() !== 'cancelled' && (
                          <div> {/* Wrapped IconButton and Menu in a div */}
                            <IconButton
                              aria-label="event actions"
                              aria-controls={`event-menu-${event._id}`}
                              aria-haspopup="true"
                              onClick={(e) => handleMenuOpen(e, event)}
                              size="small"
                            >
                              <MoreVertIcon fontSize="small" />
                            </IconButton>
                            <Menu
                              id={`event-menu-${event._id}`}
                              anchorEl={anchorEl}
                              open={Boolean(anchorEl) && eventActionTarget?._id === event._id}
                              onClose={handleMenuClose}
                            >
                              {/* Add other menu items like "Edit Event", "View Details" here if needed */}
                              <MenuItem
                                onClick={() => handleOpenEditDialog(eventActionTarget)}
                                // disabled={eventActionTarget?.status && eventActionTarget.status.toLowerCase() === 'cancelled'} // Or other conditions
                              >
                                Edit Event
                              </MenuItem>
                              <MenuItem
                                onClick={() => handleOpenDeleteDialog(eventActionTarget)}
                                disabled={deleteInProgress} // Potentially add other conditions e.g. event status
                                sx={{ color: 'error.main' }}
                              >
                                {deleteInProgress && eventToDelete?._id === eventActionTarget?._id ? (
                                  <CircularProgress size={20} color="inherit" sx={{mr:1}} />
                                ) : null}
                                Delete Event
                              </MenuItem>
                            </Menu>
                          </div>
                        )}
                      </Stack>
                      <CardContent> {/* Removed sx={{ pt: 0 }} */}
                        <Grid container spacing={2}> {/* Changed spacing to 2 */}
                          <Grid item xs={12} sm={6}>
                            <Typography variant="body2" color="text.secondary">Location: <Typography component="span" variant="body2" color="text.primary">{event.location || 'N/A'}</Typography></Typography>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="body2" color="text.secondary">Category: <Typography component="span" variant="body2" color="text.primary">
                              {Array.isArray(event.category) && event.category.length > 0 ? event.category[0] : event.category || 'N/A'}
                            </Typography></Typography>
                          </Grid>
                          <Grid item xs={6} sm={3}>
                            <Typography variant="body2" color="text.secondary">Price: <Typography component="span" variant="body2" color="text.primary">${event.ticketPrice != null ? event.ticketPrice.toFixed(2) : 'N/A'}</Typography></Typography>
                          </Grid>
                          <Grid item xs={6} sm={3}>
                            <Typography variant="body2" color="text.secondary">Total Tickets: <Typography component="span" variant="body2" color="text.primary">{event.totalTickets != null ? event.totalTickets : 'N/A'}</Typography></Typography>
                          </Grid>
                           <Grid item xs={6} sm={3}>
                            <Typography variant="body2" color="text.secondary">Tickets Sold: <Typography component="span" variant="body2" color="text.primary">{event.ticketsSold != null ? event.ticketsSold : '0'}</Typography></Typography>
                          </Grid>
                           <Grid item xs={6} sm={3}>
                            <Typography variant="body2" color="text.secondary">Revenue: <Typography component="span" variant="body2" color="text.primary">
                              {
                                (() => {
                                  const ticketsSold = Number(event.ticketsSold);
                                  const ticketPrice = Number(event.ticketPrice);
                                  if (!isNaN(ticketsSold) && !isNaN(ticketPrice)) {
                                    return `$${(ticketsSold * ticketPrice).toFixed(2)}`;
                                  }
                                  return '$0.00';
                                })()
                              }
                            </Typography></Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                ))}
              </Stack>
          )}
        </CardContent>
        {/* Delete Confirmation Dialog */}
        {eventToDelete && (
            <Dialog
                open={openDeleteDialog}
                onClose={handleCloseDeleteDialog}
                aria-labelledby="delete-event-dialog-title"
                aria-describedby="delete-event-dialog-description"
            >
              <DialogTitle id="delete-event-dialog-title">Confirm Event Deletion</DialogTitle>
              <DialogContent>
                <DialogContentText id="delete-event-dialog-description">
                  Are you sure you want to permanently delete the event "{eventToDelete.title || 'this event'}"?
                  This action cannot be undone.
                </DialogContentText>
                {deleteError && <Alert severity="error" sx={{ mt: 2 }}>{deleteError}</Alert>}
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDeleteDialog} disabled={deleteInProgress}>Back</Button>
                <Button onClick={handleConfirmDelete} color="error" autoFocus disabled={deleteInProgress}>
                  {deleteInProgress ? <CircularProgress size={24} color="inherit" /> : "Delete Permanently"}
                </Button>
              </DialogActions>
            </Dialog>
        )}
        {/* Edit Event Dialog */}
        {eventToEdit && (
          <Dialog
            open={openEditDialog}
            onClose={handleCloseEditDialog}
            aria-labelledby="edit-event-dialog-title"
          >
            <DialogTitle id="edit-event-dialog-title">Edit Event: {eventToEdit.title}</DialogTitle>
            <DialogContent>
              <DialogContentText sx={{mb: 2}}>
                Modify the details for your event. Only location, total tickets, and date can be updated.
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="location"
                name="location"
                placeholder="Location"
                type="text"
                fullWidth
                variant="outlined"
                value={editFormData.location}
                onChange={handleEditFormChange}
                disabled={editInProgress}
              />
              <TextField
                margin="dense"
                id="totalTickets"
                name="totalTickets"
                placeholder="Total Tickets"
                type="number"
                fullWidth
                variant="outlined"
                value={editFormData.totalTickets}
                onChange={handleEditFormChange}
                disabled={editInProgress}
                inputProps={{ min: 0 }}
              />
              <TextField
                margin="dense"
                id="date"
                name="date"
                placeholder="Date and Time"
                type="datetime-local"
                fullWidth
                variant="outlined"
                value={editFormData.date}
                onChange={handleEditFormChange}
                InputLabelProps={{
                  shrink: true, // Keep shrink true if a label-like text is needed for date
                }}
                disabled={editInProgress}
              />
              {editError && <Alert severity="error" sx={{ mt: 2 }}>{editError}</Alert>}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseEditDialog} disabled={editInProgress}>Back</Button>
              <Button onClick={handleConfirmEdit} color="primary" autoFocus disabled={editInProgress}>
                {editInProgress ? <CircularProgress size={24} color="inherit" /> : "Save Changes"}
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </Card>
  );
}