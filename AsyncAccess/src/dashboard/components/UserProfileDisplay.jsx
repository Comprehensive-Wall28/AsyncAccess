import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box'; // Keep Box
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Skeleton from '@mui/material/Skeleton';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { updateUserProfilePicture } from '../../services/authService';

// Title component similar to the preview
const Title = (props) => (
  <Typography component="h2" variant="h6" color="primary" gutterBottom>
    {props.children}
  </Typography>
);

// Define your backend URL here. If your API and static files are served from the same base URL,
// and API_BASE_URL in authService.js is, e.g., 'http://localhost:5000/api/v1',
// then BACKEND_STATIC_BASE_URL would be 'http://localhost:5000'.
// Use the root URL of your backend server where static files are hosted.
const BACKEND_STATIC_BASE_URL = import.meta.env.VITE_BACKEND_SERVER_URL;

export default function UserProfileDisplay({ currentUser, isLoading, setCurrentUser }) {
  const fileInputRef = React.useRef(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadError, setUploadError] = React.useState('');

  if (isLoading) {
    return (
      <Card sx={{ mt: 2, p: 2, width: '100%' }}>
        <CardContent>
          <Title>User Profile</Title>
          <Grid container spacing={2} alignItems="center">
            <Grid xs={12} sm={3} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Skeleton variant="circular" width={120} height={120} />
            </Grid>
            <Grid xs={12} sm={9}>
              <Skeleton variant="text" sx={{ fontSize: '1.8rem' }} width="60%" />
              <Skeleton variant="text" width="80%" />
              <Skeleton variant="text" width="70%" />
              <Skeleton variant="text" width="50%" />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  }

  if (!currentUser) {
    return (
      <Card sx={{ mt: 2, p: 2, width: '100%' }}>
        <CardContent>
          <Title>User Profile</Title>
          <Typography>Could not load user profile information.</Typography>
        </CardContent>
      </Card>
    );
  }

  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setIsUploading(true);
      setUploadError('');
      try {
        const response = await updateUserProfilePicture(file);
        if (response.user) {
          setCurrentUser(response.user); // Update the user state in Dashboard.jsx
        }
      } catch (error) {
        console.error("Error uploading profile picture:", error);
        setUploadError(error.message || 'Failed to upload profile picture.');
      } finally {
        setIsUploading(false);
        // Clear the file input value so the same file can be selected again if needed
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    }
  };

  const profilePictureSrc = currentUser.profilePicture
    ? (currentUser.profilePicture.startsWith('http') ? currentUser.profilePicture : `${BACKEND_STATIC_BASE_URL}${currentUser.profilePicture}`)
    : null;

  return (
    <Card sx={{ mt: 2, p: 2, width: '100%' }}>
      <CardContent>
        <Title>User Profile</Title>
        {uploadError && <Alert severity="error" sx={{ mb: 2 }}>{uploadError}</Alert>}
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={3} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
            <input
              type="file"
              hidden
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              disabled={isUploading}
            />
            <Box sx={{ position: 'relative', cursor: isUploading ? 'default' : 'pointer' }} onClick={!isUploading ? handleAvatarClick : undefined}>
              <Avatar
                src={profilePictureSrc}
                sx={{ width: 120, height: 120, fontSize: '4rem', border: '2px solid', borderColor: 'divider' }}
              >
                {!profilePictureSrc && <AccountCircleIcon sx={{ fontSize: 'inherit' }} />}
              </Avatar>
              {!isUploading && (
                <IconButton
                  size="small"
                  sx={{ position: 'absolute', bottom: 5, right: 5, backgroundColor: 'rgba(0,0,0,0.5)', '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)'} }}
                  aria-label="upload picture"
                >
                  <PhotoCameraIcon sx={{color: 'white'}}/>
                </IconButton>
              )}
              {isUploading && <CircularProgress size={120} sx={{ position: 'absolute', top: 0, left: 0, zIndex: 1, color: 'primary.main' }} />}
            </Box>
          </Grid>
          <Grid item xs={12} sm={9}>
            <Box mb={1}><Typography variant="subtitle1" color="text.secondary">Name:</Typography><Typography variant="h5">{currentUser.name}</Typography></Box>
            <Box mb={1}><Typography variant="subtitle1" color="text.secondary">Email:</Typography><Typography variant="body1">{currentUser.email}</Typography></Box>
            <Box mb={1}><Typography variant="subtitle1" color="text.secondary">Role:</Typography><Typography variant="body1">{currentUser.role}</Typography></Box>
            {currentUser.age !== undefined && currentUser.age !== null && (
              <Box mb={1}><Typography variant="subtitle1" color="text.secondary">Age:</Typography><Typography variant="body1">{currentUser.age}</Typography></Box>
            )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}