import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Paper, Typography, List, ListItem, ListItemText, Avatar,
  IconButton, Button, CircularProgress, Alert, Divider, Stack, Input,
  OutlinedInput, InputAdornment, FormControl, // Added OutlinedInput, InputAdornment, FormControl
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle // Added Dialog components
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { getCurrentUserProfile, updateUserProfile, deleteUserById, logoutUser } from '../../services/userService'; // Added deleteUserById, logoutUser
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const VITE_BACKEND_SERVER_URL = import.meta.env.VITE_BACKEND_SERVER_URL;

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [editingField, setEditingField] = useState(null); // 'name', 'age'
  const [editValue, setEditValue] = useState('');

  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate(); // Initialize useNavigate

  // State for delete account dialog
  const [openDeleteAccountDialog, setOpenDeleteAccountDialog] = useState(false);
  const [deleteAccountLoading, setDeleteAccountLoading] = useState(false);
  const [deleteAccountError, setDeleteAccountError] = useState('');

  // Basic auth navigation handler for consistency
  const handleAuthNavigation = (err) => {
    const errorMessage = err.response?.data?.message || err.message || 'An unexpected error occurred.';
    if (err.response) {
      if (err.response.status === 401) {
        console.warn(`Received 401 from API. Redirecting to /unauthenticated`);
        navigate('/unauthenticated', { replace: true });
        return true;
      }
      if (err.response.status === 403) {
        console.warn(`Received 403 from API. Redirecting to /unauthorized`);
        navigate('/unauthorized', { replace: true });
        return true;
      }
      if (errorMessage.includes("User not found") || (err.response.status === 404 && errorMessage.includes("profile"))) {
        console.warn(`Received error "${errorMessage}". Redirecting to /notfound`);
        navigate('/notfound', { replace: true });
        return true;
      }
    }
    return false;
  };


  const fetchUser = async () => {
    setIsLoading(true);
    try {
      const userData = await getCurrentUserProfile();
      setUser(userData);
      setError('');
    } catch (err) {
      if (handleAuthNavigation(err)) return; // Use auth navigation
      setError(err.message || 'Failed to fetch user data.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []); // navigate is stable

  const handleEdit = (field, currentValue) => {
    setEditingField(field);
    setEditValue(currentValue);
    setSuccessMessage('');
    setError('');
  };

  const handleCancelEdit = () => {
    setEditingField(null);
    setEditValue('');
  };

  const handleSave = async (field) => {
    setIsLoading(true);
    setSuccessMessage('');
    setError('');
    try {
      const updateData = { [field]: editValue };
      const response = await updateUserProfile(updateData);
      setUser(response.user); // Update user state with response from backend
      setSuccessMessage(response.msg || 'Profile updated successfully!');
      setEditingField(null);
    } catch (err) {
      if (handleAuthNavigation(err)) return; // Use auth navigation
      setError(err.message || `Failed to update ${field}.`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfilePictureFile(file);
      setProfilePicturePreview(URL.createObjectURL(file));
      setSuccessMessage('');
      setError('');
    }
  };

  const handleProfilePictureUpload = async () => {
    if (!profilePictureFile) return;
    setIsLoading(true);
    setSuccessMessage('');
    setError('');
    try {
      const response = await updateUserProfile({ profilePictureFile });
      setUser(response.user);
      setSuccessMessage(response.msg || 'Profile picture updated successfully!');
      setProfilePictureFile(null);
      setProfilePicturePreview(null);
    } catch (err) {
      if (handleAuthNavigation(err)) return; // Use auth navigation
      setError(err.message || 'Failed to upload profile picture.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRemoveProfilePicture = async () => {
    setIsLoading(true);
    setSuccessMessage('');
    setError('');
    try {
      const response = await updateUserProfile({ profilePicture: null }); // Send null to indicate removal
      setUser(response.user);
      setSuccessMessage(response.msg || 'Profile picture removed successfully!');
      setProfilePictureFile(null);
      setProfilePicturePreview(null);
    } catch (err) {
      if (handleAuthNavigation(err)) return; // Use auth navigation
      setError(err.message || 'Failed to remove profile picture.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDeleteAccountDialog = () => {
    setDeleteAccountError('');
    setOpenDeleteAccountDialog(true);
  };

  const handleCloseDeleteAccountDialog = () => {
    setOpenDeleteAccountDialog(false);
  };

  const handleConfirmDeleteAccount = async () => {
    if (!user || !user._id) {
      setDeleteAccountError('User information is not available.');
      return;
    }
    setDeleteAccountLoading(true);
    setDeleteAccountError('');
    try {
      await deleteUserById(user._id);
      await logoutUser(); 
      navigate('/login', { replace: true });
    } catch (err) {
      if (handleAuthNavigation(err)) return;
      setDeleteAccountError(err.response?.data?.message || err.message || 'Failed to delete account. Please try again.');
      setDeleteAccountLoading(false);
    }
  };

  if (isLoading && !user) { // Show loading only on initial load
    return <CircularProgress />;
  }

  if (error && !user) { // Show error only if user data couldn't be fetched initially
    return <Alert severity="error">{error}</Alert>;
  }

  if (!user) {
    return <Typography>No user data found.</Typography>;
  }

  const renderEditableField = (label, field, value) => (
    <ListItem
      secondaryAction={ // This will now hold Edit or Save/Cancel
        editingField === field ? (
          <Stack direction="row" spacing={0.5}> {/* Save/Cancel buttons */}
            <IconButton
              aria-label="save"
              onClick={() => handleSave(field)}
              disabled={isLoading || String(editValue) === String(value)} // Disable if value hasn't changed
              size="small"
              edge="end"
            >
              <SaveIcon fontSize="small" />
            </IconButton>
            <IconButton
              aria-label="cancel"
              onClick={handleCancelEdit}
              disabled={isLoading}
              size="small"
              edge="end"
            >
              <CancelIcon fontSize="small" />
            </IconButton>
          </Stack>
        ) : ( // Edit button
          <IconButton
            edge="end"
            aria-label="edit"
            onClick={() => handleEdit(field, value)}
            disabled={isLoading}
            size="small" // Consistent button size
          >
            <EditIcon fontSize="small" /> {/* Consistent icon size */}
          </IconButton>
        )
      }
      // sx={{ alignItems: 'flex-start' }} // Optional: if vertical alignment needs adjustment for taller content
    >
      <ListItemText
        primary={label}
        secondary={
          editingField === field ? (
            <FormControl
              variant="outlined"
              size="small"
              sx={{
                width: { xs: '100%', sm: '25ch', md: '30ch' }, // Narrower, responsive width like Search.jsx
                mt: 0.5, // Space between label (primary) and input (secondary)
              }}
            >
              <OutlinedInput
                id={`edit-${field}-${user?._id || 'user'}`}
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                type={field === 'age' ? 'number' : 'text'}
                placeholder={`New ${label.toLowerCase()}`}
                autoFocus
                // Icons are now in secondaryAction, so no endAdornment here
              />
            </FormControl>
          ) : (
            // Ensure value is a string for ListItemText, or "Not set"
            value !== null && value !== undefined && value !== '' ? String(value) : 'Not set'
          )
        }
        primaryTypographyProps={{ sx: { mb: editingField === field ? 0.5 : 0 } }} // Margin below label when editing
      />
    </ListItem>
  );

  const profilePicSrc = profilePicturePreview 
    ? profilePicturePreview 
    : user.profilePicture 
      ? `${VITE_BACKEND_SERVER_URL}${user.profilePicture}` 
      : null;

  return (
    <Paper elevation={3} sx={{ p: 3, width: '100%', mt: 4 }}> {/* Removed maxWidth and margin: 'auto', added width: '100%' */}
      <Typography variant="h5" gutterBottom component="div" sx={{ mb: 2 }}>
        User Information
      </Typography>

      {isLoading && <CircularProgress size={20} sx={{ mb: 1 }} />}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}

      <List>
        <ListItem>
          <Stack direction="column" alignItems="center" spacing={2} sx={{ width: '100%'}}>
            <Avatar sx={{ width: 100, height: 100, mb: 1 }} src={profilePicSrc}>
              {!profilePicSrc && <AccountCircleIcon sx={{ fontSize: 100 }} />}
            </Avatar>
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              sx={{ display: 'none' }}
              inputRef={fileInputRef}
              id="profile-picture-input"
            />
      
            {profilePictureFile && (
              <Button variant="contained" color="primary" onClick={handleProfilePictureUpload} disabled={isLoading} sx={{mt: 1}}>
                Save Picture
              </Button>
            )}
            {user.profilePicture && !profilePictureFile && (
                 <Button variant="outlined" color="secondary" onClick={handleRemoveProfilePicture} disabled={isLoading} sx={{mt: 1}}>
                    Remove Picture
                </Button>
            )}
          </Stack>
        </ListItem>
        <Divider sx={{ my: 2 }} />

        {renderEditableField("Name", "name", user.name)}
        <Divider component="li" />

        <ListItem>
          <ListItemText primary="Email" secondary={user.email} />
        </ListItem>
        <Divider component="li" />

        {renderEditableField("Age", "age", user.age)}
        <Divider component="li" />

        <ListItem>
          <ListItemText primary="Role" secondary={user.role} />
        </ListItem>
      </List>

      <Divider sx={{ my: 3 }} />

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <Button
          variant="contained"
          color="error"
          onClick={handleOpenDeleteAccountDialog}
          disabled={isLoading || deleteAccountLoading}
        >
          Delete Account
        </Button>
      </Box>

      {/* Delete Account Confirmation Dialog */}
      <Dialog
        open={openDeleteAccountDialog}
        onClose={handleCloseDeleteAccountDialog}
        aria-labelledby="delete-account-dialog-title"
        aria-describedby="delete-account-dialog-description"
      >
        <DialogTitle id="delete-account-dialog-title">{"Confirm Account Deletion"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-account-dialog-description">
            Are you sure you want to delete your account? This action is permanent and cannot be undone.
            All your data will be removed.
          </DialogContentText>
          {deleteAccountError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {deleteAccountError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteAccountDialog} disabled={deleteAccountLoading}>
            Cancel
          </Button>
          <Button onClick={handleConfirmDeleteAccount} color="error" autoFocus disabled={deleteAccountLoading}>
            {deleteAccountLoading ? <CircularProgress size={24} color="inherit" /> : "Delete My Account"}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}