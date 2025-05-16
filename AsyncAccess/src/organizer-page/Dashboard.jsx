import * as React from 'react';

import { alpha } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import AppNavbar from './components/AppNavbar';
import Header from './components/Header';
import MainGrid from './components/MainGrid';
import SideMenu from './components/SideMenu';
import AppTheme from '../shared-theme/AppTheme';

import {
  chartsCustomizations,
  dataGridCustomizations,
  datePickersCustomizations,
  treeViewCustomizations,
} from './theme/customizations';
import { useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
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
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchUserProfile = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await apiClient.get('/users/profile');
        // Axios automatically parses JSON and throws for non-2xx status codes
        setCurrentUser(response.data);

      } catch (err) {
        console.error("Failed to fetch user profile:", err);
        if (err.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          if (err.response.status === 401 || err.response.status === 403) {
            setError('Authentication required. Redirecting to sign-in...');
            localStorage.removeItem('currentUser');
            setTimeout(() => navigate('/signin', { state: { from: 'dashboard_auth_error' } }), 2000);
            // No return here, allow finally to run. Component might unmount after navigate.
          } else {
            setError(err.response.data?.message || `Server error: ${err.response.status}`);
          }
        } else if (err.request) {
          // The request was made but no response was received
          setError('Network error. Please check your connection.');
        } else {
          // Something else happened in setting up the request that triggered an Error
          setError(err.message || 'An unexpected error occurred.');
        }
        setCurrentUser(null); // Ensure currentUser is null on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  return (
    <AppTheme {...props} themeComponents={xThemeComponents}>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: 'flex' }}>
        <SideMenu currentUser={currentUser} />
        <AppNavbar currentUser={currentUser} />
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
            {error && !currentUser && <Alert severity="error" sx={{ width: '100%', mt: 2 }}>{error}</Alert>}
            <MainGrid currentUser={currentUser} isLoading={isLoading} />
          </Stack>
        </Box>
      </Box>
    </AppTheme>
  );
}