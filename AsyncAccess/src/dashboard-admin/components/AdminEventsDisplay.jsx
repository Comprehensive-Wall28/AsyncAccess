import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

import * as eventService from '../../services/eventService';

const Title = (props) => (
  <Typography component="h2" variant="h6" color="inherit" gutterBottom>
    {props.children}
  </Typography>
);

const EventCard = ({ event, onOpenMenu }) => (
  <Card variant="outlined" sx={{ mb: 2 }}>
    <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 1.5, px: 2 }}>
      <Box sx={{ flexGrow: 1, mr: 1 }}> {/* Text content takes available space, with a small margin before the icon */}
        <Typography variant="h6" component="div">
          {event.title || '[No Title Provided]'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {event.location || 'Location not specified'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Date: {event.date ? new Date(event.date).toLocaleDateString() : 'N/A'}
        </Typography>
      </Box>
      {onOpenMenu && (
        <Box> {/* Wrapper for the icon button */}
          <IconButton
            aria-label="event actions"
            onClick={(e) => onOpenMenu(e, event)}
            size="small"
          >
            <MoreVertIcon />
          </IconButton>
        </Box>
      )}
    </CardContent>
  </Card>
);

export default function AdminEventsDisplay() {
  const [events, setEvents] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [showApproved, setShowApproved] = React.useState(true);

  // State for menu
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [eventActionTarget, setEventActionTarget] = React.useState(null);

  // State for Edit Dialog
  const [openEditDialog, setOpenEditDialog] = React.useState(false);
  const [eventToEdit, setEventToEdit] = React.useState(null);
  const [editFormData, setEditFormData] = React.useState({
    status: '',
  });
  const [editInProgress, setEditInProgress] = React.useState(false);
  const [editError, setEditError] = React.useState('');


  React.useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      setError('');
      try {
        const data = await eventService.getAllEventsForAdmin();
        setEvents(data || []);
      } catch (err) {
        setError(err.data?.error || err.message || 'Failed to fetch events.');
        setEvents([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleMenuOpen = (event, eventData) => {
    setEventActionTarget(eventData);
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setEventActionTarget(null);
  };

  const handleOpenEditDialog = (eventData) => {
    setEventToEdit(eventData);
    setEditFormData({
      status: '', // Initialize to empty to force selection
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

    if (!editFormData.status) {
      setEditError("Please select a new status (Approved or Rejected).");
      setEditInProgress(false); // Ensure spinner stops if it was somehow started
      return;
    }

    setEditInProgress(true);
    setEditError('');

    const dataToUpdate = {
      status: editFormData.status,
    };
    
    if (dataToUpdate.status === eventToEdit.status) {
        setEditError("The selected status is the same as the event's current status. Please choose a different status to make a change.");
        setEditInProgress(false);
        return;
    }

    try {
      const updatedEventFromServer = await eventService.adminUpdateEventById(eventToEdit._id, dataToUpdate);
      setEvents(prevEvents =>
        prevEvents.map(event =>
          event._id === eventToEdit._id ? updatedEventFromServer : event
        )
      );
      handleCloseEditDialog();
    } catch (err) {
      const errorMessage = (err.data && err.data.error) || err.message || 'Failed to update event.';
      setEditError(`Failed to update event: ${errorMessage}`);
    } finally {
      setEditInProgress(false);
    }
  };


  const pendingEvents = events.filter(event => event.status && event.status.toLowerCase() === 'pending');
  const approvedEvents = events.filter(event => event.status && event.status.toLowerCase() === 'approved');
  const rejectedEvents = events.filter(event => event.status && event.status.toLowerCase() === 'rejected');
  const otherEvents = events.filter(event => event.status && !['pending', 'approved', 'rejected'].includes(event.status.toLowerCase()));


  return (
    <Card sx={{ mt: 4, p: 2, width: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Title>Event Management</Title>
          <Button
            variant="outlined"
            onClick={() => setShowApproved(!showApproved)}
            size="small"
          >
            {showApproved ? "Hide Approved Events" : "Show Approved Events"}
          </Button>
        </Box>

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, mb: 1 }}>
              <Chip label="Pending Approval" color="warning" variant="outlined" />
              <Typography variant="subtitle1" sx={{ ml: 1, fontWeight: 'medium' }}>
                ({pendingEvents.length})
              </Typography>
            </Box>
            {pendingEvents.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                No events are currently pending approval.
              </Typography>
            ) : (
              <Stack spacing={1} sx={{ mb: 3 }}>
                {pendingEvents.map((event) => (
                  <EventCard
                    key={event._id}
                    event={event}
                    onOpenMenu={handleMenuOpen}
                  />
                ))}
              </Stack>
            )}

            {showApproved && (
              <>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, mb: 1 }}>
                  <Chip label="Approved Events" color="success" variant="outlined" />
                  <Typography variant="subtitle1" sx={{ ml: 1, fontWeight: 'medium' }}>
                    ({approvedEvents.length})
                  </Typography>
                </Box>
                {approvedEvents.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    No events have been approved yet.
                  </Typography>
                ) : (
                  <Stack spacing={1}>
                    {approvedEvents.map((event) => (
                      <EventCard key={event._id} event={event} onOpenMenu={handleMenuOpen} />
                    ))}
                  </Stack>
                )}
              </>
            )}
            
            {/* Display rejected events */}
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, mb: 1 }}>
              <Chip label="Rejected Events" color="error" variant="outlined" />
              <Typography variant="subtitle1" sx={{ ml: 1, fontWeight: 'medium' }}>
                ({rejectedEvents.length})
              </Typography>
            </Box>
            {rejectedEvents.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                No events have been rejected.
              </Typography>
            ) : (
              <Stack spacing={1} sx={{ mb: 3 }}>
                {rejectedEvents.map((event) => (
                  <EventCard
                    key={event._id}
                    event={event}
                    onOpenMenu={handleMenuOpen}
                  />
                ))}
              </Stack>
            )}

            {/* Display other events (e.g., cancelled) */}
            {otherEvents.length > 0 && (
                 <>
                    <Divider sx={{ my: 2 }} />
                     <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, mb: 1 }}>
                        <Chip label="Other Events" color="default" variant="outlined" />
                        <Typography variant="subtitle1" sx={{ ml: 1, fontWeight: 'medium' }}>
                            ({otherEvents.length})
                        </Typography>
                    </Box>
                    <Stack spacing={1}>
                        {otherEvents.map((event) => (
                            <EventCard key={event._id} event={event} onOpenMenu={handleMenuOpen} />
                        ))}
                    </Stack>
                 </>
            )}

            {!showApproved && approvedEvents.length > 0 && (
                 <Typography variant="body2" color="text.secondary" sx={{mt: 2}}>
                    {approvedEvents.length} approved event(s) are hidden.
                 </Typography>
            )}

            {pendingEvents.length === 0 && approvedEvents.length === 0 && rejectedEvents.length === 0 && otherEvents.length === 0 && !isLoading && !error && (
                 <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100px', mt: 2 }}>
                    <Typography variant="subtitle1" color="text.secondary">
                        No events found.
                    </Typography>
                 </Box>
            )}
          </>
        )}
      </CardContent>
      {eventActionTarget && (
        <Menu
          id={`event-actions-menu-${eventActionTarget._id}`}
          anchorEl={anchorEl}
          open={Boolean(anchorEl) && eventActionTarget?._id === eventActionTarget._id}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => handleOpenEditDialog(eventActionTarget)}>
            Edit Event
          </MenuItem>
          {/* Add other admin actions like delete or view details if needed */}
        </Menu>
      )}

      {eventToEdit && (
        <Dialog
          open={openEditDialog}
          onClose={handleCloseEditDialog}
          aria-labelledby="edit-event-dialog-title"
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle id="edit-event-dialog-title">Edit Event Status: {eventToEdit.title}</DialogTitle>
          <DialogContent>
            <DialogContentText sx={{mb:1}}>
              Modify the event status.
            </DialogContentText>
            {editError && <Alert severity="error" sx={{ mb: 2 }}>{editError}</Alert>}
            <FormControl fullWidth margin="dense" variant="outlined" disabled={editInProgress}>
              <InputLabel htmlFor="status-select"></InputLabel>
              <Select
                value={editFormData.status}
                onChange={handleEditFormChange}
                label="Status" // This connects to the InputLabel
                inputProps={{
                  name: 'status',
                  id: 'status-select',
                }}
                displayEmpty // Important to show the placeholder when value is ""
              >
                <MenuItem value="" disabled>
                  <em>Select new status</em>
                </MenuItem>
                <MenuItem value="approved">Approved</MenuItem>
                <MenuItem value="rejected">Rejected</MenuItem>
                {/* Removed cancelled from here as it's usually a separate action, but admin can still set it if backend allows */}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEditDialog} disabled={editInProgress}>Cancel</Button>
            <Button onClick={handleConfirmEdit} color="primary" autoFocus disabled={editInProgress}>
              {editInProgress ? <CircularProgress size={24} color="inherit" /> : "Save Changes"}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Card>
  );
}
