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
import Sitemark from './AsyncAccessIcon';
import Menu from '@mui/material/Menu';
import { Link } from 'react-router-dom'; // Import Link

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

  const [anchorEl, setAnchorEl] = React.useState(null);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const menuId = 'dashboard-menu';

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
            <Sitemark />
            <Box sx={{ display: { xs: 'none', md: 'flex' }, ml: 2 }}> {/* Added ml: 2 here */}
              <Button
                variant="text"
                color="info"
                size="small"
                sx={{ px: 1 }}
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleMenuOpen}
              >
                Dashboards
              </Button>
              <Menu
                id={menuId}
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                MenuListProps={{ dense: true }}
                PaperProps={{
                  sx: {
                    display: 'flex',
                    minWidth: 200,
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
                <MenuItem onClick={handleMenuClose} component={Link} to="/dashboard">
                  User Dashboard
                </MenuItem>
                <MenuItem onClick={handleMenuClose} component={Link} to="/dashboard-admin">
                  Admin Dashboard
                </MenuItem>
                <MenuItem onClick={handleMenuClose} component={Link} to="/dashboard-organizer">
                  Organizer Dashboard
                </MenuItem>
              </Menu>
              <Button variant="text" color="info" size="small" component={Link} to="/events" sx={{ px: 1 }}>
                Events
              </Button>
              {/* <Button variant="text" color="info" size="small">
                Testimonials
              </Button> */}
              <Button variant="text" color="info" size="small" sx={{ px: 1 }}>
                Highlights
              </Button>
              {/* <Button variant="text" color="info" size="small">
                Pricing
              </Button> */}
              {/* <Button variant="text" color="info" size="small" sx={{ minWidth: 0 }}>
                FAQ
              </Button> */}
              {/* <Button variant="text" color="info" size="small" sx={{ minWidth: 0 }}>
                Blog
              </Button> */}
            </Box>
          </Box>
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              gap: 1,
              alignItems: 'center',
            }}
          > {/* Use Link component for navigation */}
            <Button color="primary" variant="text" size="small" component={Link} to="/login">
              Sign in
            </Button>
            <Button color="primary" variant="contained" size="small" component={Link} to="/signup"> {/* Assuming /signup for this button */}
              Sign up
            </Button>
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
                <Button color="primary" variant="outlined" fullWidth component={Link} to="/dashboard">
                  Your Dashboard
                </Button>
                {/* <MenuItem>Pricing</MenuItem>
                <MenuItem>FAQ</MenuItem>
                <MenuItem>Blog</MenuItem> */}
                <Divider sx={{ my: 2 }} /> {/* Adjusted margin slightly */}
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
              </Box>
            </Drawer>
          </Box>
        </StyledToolbar>
      </Container>
    </AppBar>
  );
}
