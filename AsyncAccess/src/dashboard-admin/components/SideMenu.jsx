import * as React from 'react';
import { styled } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import MuiDrawer, { drawerClasses } from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import MenuContent from './MenuContent';
import OptionsMenu from './OptionsMenu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AsyncAccessLogo from '../../home-page/components/AsyncAccessIcon';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import InfoIcon from '@mui/icons-material/Info'; // Or a more appropriate icon like EventIcon if available
import EventIcon from '@mui/icons-material/Event'; // Assuming EventIcon is suitable and imported

// Same as in UserProfileDisplay.jsx - ensure this is consistent or use a shared config
// Use the root URL of your backend server where static files are hosted.
const BACKEND_STATIC_BASE_URL = import.meta.env.VITE_BACKEND_SERVER_URL;

const drawerWidth = 240;

const Drawer = styled(MuiDrawer)({
  width: drawerWidth,
  flexShrink: 0,
  boxSizing: 'border-box',
  mt: 10,
  [`& .${drawerClasses.paper}`]: {
    width: drawerWidth,
    boxSizing: 'border-box',
  },
});

const getFirstAndLastName = (fullName) => {
  if (!fullName) return "";
  const nameParts = fullName.trim().split(/\s+/);
  if (nameParts.length === 1) {
    return nameParts[0]; // Only one name part (e.g., "Cher")
  }
  if (nameParts.length > 1) {
    return `${nameParts[0]} ${nameParts[nameParts.length - 1]}`; // First and Last name
  }
  return fullName; // Fallback to full name if an edge case occurs
};

export default function SideMenu({ currentUser, onMenuItemClick, selectedItem }) {
  const profilePictureSrc = currentUser?.profilePicture
    ? (currentUser.profilePicture.startsWith('http') ? currentUser.profilePicture : `${BACKEND_STATIC_BASE_URL}${currentUser.profilePicture}`)
    : null;
  const displayName = currentUser ? getFirstAndLastName(currentUser.name) : "Loading...";

  const menuItems = [
    { text: 'Home', icon: <HomeIcon />, action: 'home' },
    { text: 'User Profile', icon: <PersonIcon />, action: 'user-profile' },
    { text: 'Event Management', icon: <EventIcon />, action: 'about' }, 
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: 'none', md: 'block' },
        [`& .${drawerClasses.paper}`]: {
          backgroundColor: 'background.paper',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center', // Added for vertical centering
          justifyContent: 'center', // Added for horizontal centering
          mt: 'calc(var(--template-frame-height, 0px) + 4px)',
          p: 1.5,
        }}
      >
        <AsyncAccessLogo />
      </Box>
      <Divider />
      <Box
        sx={{
          overflow: 'auto',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <MenuContent menuItems={menuItems} onMenuItemClick={onMenuItemClick} selectedItem={selectedItem} />
      </Box>
      <Stack
        direction="row"
        sx={{
          p: 2,
          gap: 1,
          alignItems: 'center',
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Avatar
          sizes="small"
          alt={currentUser?.name || "User"}
          src={profilePictureSrc}
          sx={{ width: 36, height: 36 }}
        >
          {!profilePictureSrc && <AccountCircleIcon />}
        </Avatar>
        <Box sx={{ mr: 'auto' }}>
          <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: '16px' }}>
            {displayName}
          </Typography>
          {/* <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {currentUser ? currentUser.email : "Loading..."}
          </Typography> */}
        </Box>
        <OptionsMenu />
      </Stack>
    </Drawer>
  );
}
