import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ColorModeIconDropdown from '../../shared-theme/ColorModeIconDropdown';
import AsyncIcon from './AsyncAccessIcon';
import Menu from '@mui/material/Menu';
import { Link, useNavigate } from 'react-router-dom'; // Import Link and useNavigate
import Avatar from '@mui/material/Avatar'; // Import Avatar
import { apiClient, logout as logoutUser } from '../../services/authService'; // Import apiClient and logout

const BACKEND_STATIC_BASE_URL = import.meta.env.VITE_BACKEND_SERVER_URL; // Added

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexShrink: 0,
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter: 'blur(24px)',
  border: '1px solid',
  borderColor: (theme.vars || theme).palette.divider,
  backgroundColor: theme.vars
    ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
    : alpha(theme.palette.background.default, 0.4),
  boxShadow: (theme.vars || theme).shadows[1],
  padding: '8px 12px',
}));

export default function AppAppBar() {
  const [open, setOpen] = React.useState(false);
  // const [anchorEl, setAnchorEl] = React.useState(null); // Removed
  const [profileMenuAnchorEl, setProfileMenuAnchorEl] = React.useState(null); // For profile menu
  const [currentUser, setCurrentUser] = React.useState(null);
  const [isLoadingUser, setIsLoadingUser] = React.useState(true);
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchUserProfile = async () => {
      setIsLoadingUser(true);
      try {
        const response = await apiClient.get('/users/profile');
        setCurrentUser(response.data);
      } catch (error) {
        // If error (e.g., 401), user is not logged in
        setCurrentUser(null);
        // console.error('Error fetching user profile for AppBar:', error);
      } finally {
        setIsLoadingUser(false);
      }
    };

    fetchUserProfile();
  }, []);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };
  
  const handleProfileMenuOpen = (event) => {
    setProfileMenuAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      setCurrentUser(null);
      handleProfileMenuClose();
      navigate('/'); // Redirect to home or login page after logout
    } catch (error) {
      console.error('Logout failed:', error);
      // Optionally show an error message to the user
    }
  };

  // const menuId = 'dashboard-menu'; // Removed
  const profileMenuId = 'profile-menu';

  const getDashboardPath = () => {
    if (currentUser) {
      switch (currentUser.role) {
        case 'Admin':
          return '/dashboard-admin';
        case 'Organizer':
          return '/dashboard-organizer';
        default:
          return '/dashboard';
      }
    }
    return '/dashboard'; // Default for not logged in, or if role is not Admin/Organizer
  };

  return (
    <AppBar
      position="fixed"
      enableColorOnDark
      sx={{
        boxShadow: (theme) => (theme.palette.mode === 'light' ? 0 : theme.shadows[2]),
        bgcolor: (theme) =>
          theme.palette.mode === 'light' ? 'transparent' : theme.palette.background.default,
        backgroundImage: (theme) =>
          theme.palette.mode === 'light' ? 'none' : `linear-gradient(to bottom, ${theme.palette.background.paper}, ${theme.palette.background.default})`,
        mt: (theme) =>
          theme.palette.mode === 'light'
            ? 'calc(var(--template-frame-height, 0px) + 28px)'
            : 'calc(var(--template-frame-height, 0px))', // Adjust margin for dark mode
        transition: 'box-shadow 0.3s ease-in-out, background-color 0.3s ease-in-out',
        backdropFilter: (theme) =>
          theme.palette.mode === 'light' ? 'blur(8px)' : 'none',
      }}
    >
      <Container maxWidth="lg">
        <StyledToolbar variant="dense" disableGutters>
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', px: 0 }}>
            <AsyncIcon />
            <Box sx={{ display: { xs: 'none', md: 'flex' }, ml: 2 }}> {/* Added ml: 2 here */}
              <Button
                variant="text"
                color="info"
                size="small"
                component={Link}
                to={getDashboardPath()}
                sx={{ px: 1 }}
              >
                Dashboard
              </Button>
              {/* Menu component removed */}
              <Button variant="text" color="info" size="small" component={Link} to="/events" sx={{ px: 1 }}>
                Events
              </Button>
            </Box>
          </Box>
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              gap: 1,
              alignItems: 'center',
            }}
          > {/* Use Link component for navigation */}
            {isLoadingUser ? (
              <div /> // Or a small spinner/placeholder while loading user state
            ) : currentUser ? (
              <>
                <IconButton onClick={handleProfileMenuOpen} size="small" sx={{ p: 0 }}>
                  <Avatar 
                    alt={currentUser.name || 'User'} 
                    src={currentUser.profilePicture
                      ? (currentUser.profilePicture.startsWith('http') ? currentUser.profilePicture : `${BACKEND_STATIC_BASE_URL}${currentUser.profilePicture}`)
                      : undefined
                    }
                    sx={{ width: 32, height: 32 }}
                  />
                </IconButton>
                <Menu
                  id={profileMenuId}
                  anchorEl={profileMenuAnchorEl}
                  keepMounted
                  open={Boolean(profileMenuAnchorEl)}
                  onClose={handleProfileMenuClose}
                  MenuListProps={{ dense: true }}
                  PaperProps={{
                    sx: {
                      minWidth: 150,
                      mt: 1,
                      '& .MuiMenuItem-root': {
                        px: 2,
                        py: 1,
                        borderRadius: 1,
                        '&:hover': {
                          backgroundColor: 'action.hover',
                        },
                      },
                    },
                  }}
                >
                  <MenuItem onClick={() => { handleProfileMenuClose(); navigate(getDashboardPath()); }}>
                    Dashboard
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button color="primary" variant="text" size="small" component={Link} to="/login">
                  Sign in
                </Button>
                <Button color="primary" variant="contained" size="small" component={Link} to="/signup"> {/* Assuming /signup for this button */}
                  Sign up
                </Button>
              </>
            )}
            <ColorModeIconDropdown />
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: 1 }}>
            <ColorModeIconDropdown size="medium" />
            <IconButton aria-label="Menu button" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="top"
              open={open}
              onClose={toggleDrawer(false)}
              PaperProps={{
                sx: {
                  top: 'var(--template-frame-height, 0px)',
                },
              }}
            >
              <Box sx={{ p: 2, backgroundColor: 'background.default' }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                  }}
                >
                  <IconButton onClick={toggleDrawer(false)}>
                    <CloseRoundedIcon />
                  </IconButton>
                </Box>

                
                {/* <MenuItem>Events</MenuItem> */}
                <Button color="primary" variant="outlined" fullWidth component={Link} to={getDashboardPath()}>
                  Your Dashboard
                </Button>
                {/* <MenuItem>Pricing</MenuItem>
                <MenuItem>FAQ</MenuItem>
                <MenuItem>Blog</MenuItem> */}
                <Divider sx={{ my: 2 }} /> {/* Adjusted margin slightly */}
                {currentUser ? (
                  <MenuItem onClick={handleLogout}>
                    <Button color="primary" variant="outlined" fullWidth>
                      Logout
                    </Button>
                  </MenuItem>
                ) : (
                  <>
                    <MenuItem>
                      <Button color="primary" variant="contained" fullWidth component={Link} to="/signup">
                        Sign up
                      </Button>
                    </MenuItem>
                    <MenuItem>
                      <Button color="primary" variant="outlined" fullWidth component={Link} to="/login">
                        Sign in
                      </Button>
                    </MenuItem>
                  </>
                )}
              </Box>
            </Drawer>
          </Box>
        </StyledToolbar>
      </Container>
    </AppBar>
  );
}
