import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Paper, Typography, List, ListItem, ListItemText, ListItemAvatar, Avatar,
  IconButton, TextField, Button, CircularProgress, Alert, Divider, Stack, Input
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { getCurrentUserProfile, updateUserProfile } from '../../services/userService';

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

  const fetchUser = async () => {
    setIsLoading(true);
    try {
      const userData = await getCurrentUserProfile();
      setUser(userData);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to fetch user data.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

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
      setError(err.message || 'Failed to remove profile picture.');
      console.error(err);
    } finally {
      setIsLoading(false);
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
    <ListItem secondaryAction={
      editingField === field ? (
        <Stack direction="row" spacing={1}>
          <IconButton edge="end" aria-label="save" onClick={() => handleSave(field)} disabled={isLoading}>
            <SaveIcon />
          </IconButton>
          <IconButton edge="end" aria-label="cancel" onClick={handleCancelEdit} disabled={isLoading}>
            <CancelIcon />
          </IconButton>
        </Stack>
      ) : (
        <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(field, value)} disabled={isLoading}>
          <EditIcon />
        </IconButton>
      )
    }>
      {editingField === field ? (
        <TextField
          variant="standard"
          fullWidth
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          type={field === 'age' ? 'number' : 'text'}
        />
      ) : (
        <ListItemText primary={label} secondary={value || 'Not set'} />
      )}
    </ListItem>
  );

  const profilePicSrc = profilePicturePreview 
    ? profilePicturePreview 
    : user.profilePicture 
      ? `${VITE_BACKEND_SERVER_URL}${user.profilePicture}` 
      : null;

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 600, margin: 'auto', mt: 4 }}>
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
            <label htmlFor="profile-picture-input">
              <Button variant="outlined" component="span" startIcon={<PhotoCamera />} disabled={isLoading}>
                Change Picture
              </Button>
            </label>
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
    </Paper>
  );
}