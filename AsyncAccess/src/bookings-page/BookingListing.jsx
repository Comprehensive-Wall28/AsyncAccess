import './components/BookingListing.css';
import React, { useState, useEffect } from 'react';
import {Outlet} from 'react-router-dom';
import NotFound from '../components/NotFoundComponent';
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClock
} from 'react-icons/fa';

import { apiClient } from "../services/authService.js";
import AppTheme from "../shared-theme/AppTheme.jsx";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import SideMenu from "./components/SideMenu.jsx";
import AppNavbar from "./components/AppNavbar.jsx";
import {alpha} from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Header from "./components/Header.jsx";
import Alert from "@mui/material/Alert";
import MainGrid from "./components/MainGrid.jsx";

import {
  chartsCustomizations,
  dataGridCustomizations,
  datePickersCustomizations, treeViewCustomizations
} from "../dashboard/theme/customizations/index.jsx";

const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};

function BookingListing(props) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const userRole = user?.role ?? null;
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading] = React.useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.get('/users/profile');
        setCurrentUser(response.data);

        if (response.data.role !== 'User') {
          setNotFound(true);
          return;
        }

          const bookingsResponse = await fetch(`${apiBaseUrl}users/bookings`, {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        });

        if (!bookingsResponse.ok) {
          setError('Bookings not found');
          setLoading(false);
          return;
        }

        const data = await bookingsResponse.json();
        setBookings(data);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user.role, userRole]);

  if (notFound) {
    return <NotFound />;
  }

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
              <MainGrid bookings={bookings} loading={loading} error={error} currentUser={currentUser} />            </Stack>
          </Box>
        </Box>
      </AppTheme>
  );
}

export default BookingListing;