import * as React from 'react';

import { alpha } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
//import AppNavbar from './components/AppNavbar';
import CircularProgress from '@mui/material/CircularProgress'; // Added import
import Header from './components/Header';
import MainGrid from './components/MainGrid';
import SideMenu from './components/SideMenu';
import AppTheme from '../shared-theme/AppTheme';

import UserProfile from './components/UserProfile'; // Import the new UserProfile component
import {
  chartsCustomizations,
  dataGridCustomizations,
  datePickersCustomizations,
  treeViewCustomizations,
} from './theme/customizations';
import { useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography'; // Added import for Typography
import { apiClient } from '../services/authService'; // Import the NAMED export

const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};

export default function Dashboard(props) {
  const [currentUser, setCurrentUser] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [currentView, setCurrentView] = React.useState('home'); // State for current view
  const navigate = useNavigate();

  const handleMenuItemClick = (action) => {
    setCurrentView(action);
    // Potentially close mobile drawer if open, if applicable
  };

  React.useEffect(() => {
    const fetchUserProfile = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await apiClient.get('/users/profile');
        setCurrentUser(response.data);

      } catch (err) {
        console.error("Failed to fetch user profile:", err);
        if (err.response) {
          if (err.response.status === 401 || err.response.status === 403) {
            setError('Authentication required. Redirecting to sign-in...');
            localStorage.removeItem('currentUser');
            setTimeout(() => navigate('/login', { state: { from: 'dashboard_auth_error' } }), 2000);
          } else {
            setError(err.response.data?.message || `Server error: ${err.response.status}`);
          }
        } else if (err.request) {
          setError('Network error. Please check your connection.');
        } else {
          setError(err.message || 'An unexpected error occurred.');
        }
        setCurrentUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  let mainContent;
  if (isLoading && !currentUser && currentView !== 'user-profile') { // Show loading for home view if user not yet loaded
    mainContent = <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 120px)'}}><CircularProgress /></Box>;
  } else if (error && !currentUser && currentView !== 'user-profile') { // Show error for home view
    mainContent = <Alert severity="error" sx={{ width: '100%', mt: 2 }}>{error}</Alert>;
  } else {
    switch (currentView) {
      case 'home':
        mainContent = <MainGrid currentUser={currentUser} isLoading={isLoading && !currentUser} setCurrentUser={setCurrentUser} />;
        break;
      case 'user-profile':
        mainContent = <UserProfile />; // Render UserProfile component
        break;
      case 'about':
        mainContent = <Typography variant="h4" sx={{mt: 2}}>About Page Placeholder</Typography>; // Placeholder for About
        break;
      default:
        mainContent = <MainGrid currentUser={currentUser} isLoading={isLoading && !currentUser} setCurrentUser={setCurrentUser} />;
    }
  }
  return (
    <AppTheme {...props} themeComponents={xThemeComponents}>
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