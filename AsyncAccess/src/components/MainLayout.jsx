// src/components/MainLayout.jsx
import React, { useState } from 'react';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
// Removed MenuIcon import
import AccountCircle from '@mui/icons-material/AccountCircle';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
// Removed SideDrawer import

const MainLayout = ({ children }) => {

  // --- Profile Menu State & Handlers (Keep these) ---
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLoginClick = () => {
    handleProfileMenuClose();
    console.log('Login clicked');
    // TODO: Implement Login Navigation/Action
  };

  const handleRegisterClick = () => {
    handleProfileMenuClose();
    console.log('Register clicked');
    // TODO: Implement Register Navigation/Action
  };
  // --- End Profile Menu ---


  return (
    // Removed display: 'flex' as it's no longer needed for side-by-side layout
    <Box>
      {/* --- AppBar --- */}
      <AppBar
        position="fixed" // Keep fixed position
        elevation={0} // Keep elevation 0 if desired
        sx={{
          // --- Adjusted width and margin ---
          width: '100%', // AppBar now spans full width
          ml: 0, // No left margin needed
          // --- End Adjusted width and margin ---
          backgroundColor: (theme) => theme.palette.grey[800], // Keep distinct color
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`, // Keep border
          // Removed width/margin transitions as they are no longer dynamic
          // transition: (theme) => theme.transitions.create(['width', 'margin'], { ... }),
          zIndex: (theme) => theme.zIndex.appBar, // Use standard AppBar zIndex
        }}
      >
        <Toolbar>
          {/* Removed Menu button */}
          {/* <IconButton ... > <MenuIcon /> </IconButton> */}

          {/* Title */}
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            AsyncAccess App
          </Typography>

          {/* Profile Icon Button & Menu (Keep these) */}
          <IconButton
            size="large"
            edge="end"
            aria-label="account of current user"
            aria-controls="profile-menu-appbar"
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
          <Menu
            id="profile-menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={isMenuOpen}
            onClose={handleProfileMenuClose}
          >
            <MenuItem onClick={handleLoginClick}>Login</MenuItem>
            <MenuItem onClick={handleRegisterClick}>Register</MenuItem>
          </Menu>
          {/* End Profile Section */}
        </Toolbar>
      </AppBar>

      {/* --- Removed Side Drawer --- */}
      {/* <SideDrawer open={open} handleDrawerClose={handleDrawerClose} /> */}

      {/* --- Main Content Area --- */}
      <Box
        component="main"
        sx={{
          flexGrow: 1, // Still useful if other elements are added later
          bgcolor: 'background.default',
          p: 3, // Padding around the content area
          // --- Adjusted width and margin ---
          width: '100%', // Main content spans full width
          // No left margin needed
          // --- End Adjusted width and margin ---
          // Removed width transition
          // transition: (theme) => theme.transitions.create('width', { ... }),
        }}
      >
        {/* Toolbar Spacer: Still needed to push content below the fixed AppBar */}
        <Toolbar />

        {/* Render page content */}
        {children}
      </Box>
    </Box>
  );
};

export default MainLayout;
