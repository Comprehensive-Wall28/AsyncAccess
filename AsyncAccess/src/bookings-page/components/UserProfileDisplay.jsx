import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Skeleton from '@mui/material/Skeleton';

// Title component similar to the preview
const Title = (props) => (
  <Typography component="h2" variant="h6" color="primary" gutterBottom>
    {props.children}
  </Typography>
);

export default function UserProfileDisplay({ currentUser, isLoading }) {
  if (isLoading) {
    return (
      <Card sx={{ mt: 2, p: 2, width: '100%' }}>
        <CardContent>
          <Title>User Profile</Title>
          <Grid container spacing={2} alignItems="center">
            <Grid xs={12} sm={3} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Skeleton variant="circular" width={100} height={100} />
            </Grid>
            <Grid xs={12} sm={9}>
              <Skeleton variant="text" sx={{ fontSize: '1.5rem' }} width="60%" />
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

  return (
    <Card sx={{ mt: 2, p: 2, width: '100%' }}>
      <CardContent>
        <Title>User Profile</Title>
        <Grid container spacing={2} alignItems="center">
          <Grid xs={12} sm={3} sx={{ display: 'flex', justifyContent: 'center' }}>
            <AccountCircleIcon sx={{ fontSize: 100, color: 'text.secondary' }} />
          </Grid>
          <Grid xs={12} sm={9}>
            <Box mb={1}><Typography variant="subtitle1" color="text.secondary">Name:</Typography><Typography variant="h6">{currentUser.name}</Typography></Box>
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