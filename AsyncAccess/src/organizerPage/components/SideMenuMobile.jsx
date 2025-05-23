import PropTypes from 'prop-types';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Drawer, { drawerClasses } from '@mui/material/Drawer';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import MenuButton from './MenuButton';
import MenuContent from './MenuContent';
import { logout } from '../../services/authService'; 
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const BACKEND_STATIC_BASE_URL = import.meta.env.VITE_BACKEND_SERVER_URL;

function SideMenuMobile({ open, toggleDrawer, currentUser, onMenuItemClick, selectedItem }) {
  const profilePictureSrc = currentUser?.profilePicture
    ? (currentUser.profilePicture.startsWith('http') ? currentUser.profilePicture : `${BACKEND_STATIC_BASE_URL}${currentUser.profilePicture}`)
    : null;
  return (
    // ... (Drawer and Stack wrappers)
    <Drawer
      anchor="right"
      open={open}
      onClose={toggleDrawer(false)}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        [`& .${drawerClasses.paper}`]: {
          backgroundImage: 'none',
          backgroundColor: 'background.paper',
        },
      }}
    >
      <Stack
        sx={{
          maxWidth: '70dvw',
          height: '100%',
        }}
      >
        <Stack direction="row" sx={{ p: 2, pb: 0, gap: 1 }}>
          <Stack
            direction="row"
            sx={{ gap: 1, alignItems: 'center', flexGrow: 1, p: 1 }}
          >
            <Avatar
              sizes="small"
              alt={currentUser?.name || "User"}
              src={profilePictureSrc}
              sx={{ width: 24, height: 24 }}
            >
              {!profilePictureSrc && <AccountCircleIcon />}
            </Avatar>
            <Typography component="p" variant="h6">
              {currentUser ? currentUser.name : "Loading..."}
            </Typography>
          </Stack>
          <MenuButton showBadge>
            <NotificationsRoundedIcon />
          </MenuButton>
        </Stack>
        <Divider />
        <Stack sx={{ flexGrow: 1 }}>
          {/* ... (MenuContent) */}
          <MenuContent onMenuItemClick={onMenuItemClick} selectedItem={selectedItem} />
          <Divider />
        </Stack>
        <Stack sx={{ p: 2 }}>
          <Button
            variant="outlined"
            fullWidth
            startIcon={<LogoutRoundedIcon />}
            onClick={async () => {
              try {
                await logout();
                console.log('Logged out successfully');
                window.location.href = '/login';
              } catch (error) {
                console.error('Logout failed:', error);
              }
            }}
          >
            Logout
          </Button>
        </Stack>
      </Stack>
    </Drawer>
  );
}

SideMenuMobile.propTypes = {
  open: PropTypes.bool,
  currentUser: PropTypes.object,
  onMenuItemClick: PropTypes.func,
  selectedItem: PropTypes.string,
  toggleDrawer: PropTypes.func.isRequired,
};

export default SideMenuMobile;
