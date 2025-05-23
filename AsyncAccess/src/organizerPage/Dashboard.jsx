import * as React from 'react';
import { alpha } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress'; // Added import
import Header from './components/Header';
import MainGrid from './components/MainGrid';
import SideMenu from './components/SideMenu';
import AppTheme from '../shared-theme/AppTheme';
import UserProfile from './components/UserProfile'; // Import the new UserProfile component
import CreateEventForm from './components/CreateEventForm'; // Import the new CreateEventForm component
import EventAnalytics from './components/EventAnalytics'; // Import the new EventAnalytics component
import { useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography'; // Added import for Typography
import { apiClient } from '../services/authService'; // Import the NAMED export
import authService from '../services/authService'; // Import authService

export default function Dashboard(props) {
  const [currentUser, setCurrentUser] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [currentView, setCurrentView] = React.useState('home'); // State for current view
  const navigate = useNavigate();
  const handleAuthError = authService.useAuthRedirect(); // Initialize handleAuthError

  const handleMenuItemClick = (action) => {
    setCurrentView(action);
  };

  React.useEffect(() => {
    const fetchUserProfile = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await apiClient.get('/users/profile');
        if(response.data?.role !== 'Organizer') {
          navigate('/unauthorized', { replace: true }); // Redirect if not Organizer
        }
        setCurrentUser(response.data);

      } catch (err) {
        console.error("Failed to fetch user profile:", err);
        handleAuthError(err); // Use centralized auth error handler

        // Fallback error setting if handleAuthError doesn't redirect or throw
        // This part might need adjustment based on how handleAuthError behaves for non-redirect errors
        const errorMessage = err.response?.data?.message || err.message || 'An unexpected error occurred.';
        if (!err.response || (err.response.status !== 401 && err.response.status !== 403 && !errorMessage.includes("User not found"))) {
            setError(errorMessage);
        }
        setCurrentUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate, handleAuthError]); // Added handleAuthError to dependency array

  let mainContent;
  if (isLoading && !currentUser && currentView !== 'user-profile' && currentView !== 'analytics') { // Show loading for home view if user not yet loaded
    mainContent = <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 120px)'}}><CircularProgress /></Box>;
  } else if (error && !currentUser && currentView !== 'user-profile' && currentView !== 'analytics') { // Show error for home view
    mainContent = <Alert severity="error" sx={{ width: '100%', mt: 2 }}>{error}</Alert>;
  } else {
    switch (currentView) {
      case 'home':
        mainContent = <MainGrid currentUser={currentUser} isLoading={isLoading && !currentUser} setCurrentUser={setCurrentUser} />;
        break;
      case 'user-profile':
        mainContent = <UserProfile />; // Render UserProfile component
        break;
      case 'about': // This 'about' action now maps to Create Event
        mainContent = <CreateEventForm />; 
        break;
      case 'analytics': // New case for analytics view
        mainContent = <EventAnalytics />;
        break;
      default:
        mainContent = <MainGrid currentUser={currentUser} isLoading={isLoading && !currentUser} setCurrentUser={setCurrentUser} />;
    }
  }
  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: 'flex' }}>
        <SideMenu currentUser={currentUser} onMenuItemClick={handleMenuItemClick} selectedItem={currentView} />
        {/*<AppNavbar currentUser={currentUser} onMenuItemClick={handleMenuItemClick} selectedItem={currentView} /> */}
        {/* Main content */}
        <Box
          component="main"
          sx={(theme) => ({
            flexGrow: 1,
            backgroundColor: theme.vars
              ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
              : alpha(theme.palette.background.default, 1),
            overflow: 'auto',
          })}
        >
          <Stack
            spacing={2}
            sx={{
              alignItems: 'center',
              mx: 3,
              pb: 5,
              mt: { xs: 8, md: 0 },
            }}
          >
            <Header />
            {mainContent}
          </Stack>
        </Box>
      </Box>
    </AppTheme>
  );
}