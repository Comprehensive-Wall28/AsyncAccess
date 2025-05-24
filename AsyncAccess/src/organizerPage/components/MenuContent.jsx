import { useNavigate } from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'; // Icon for Create Event
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded'; // Icon for Analytics

const mainListItems = [
  { text: 'Home', icon: <HomeRoundedIcon />, action: 'home' },
  { text: 'User Profile', icon: <SettingsRoundedIcon />, action: 'user-profile' }, // Renamed from "Information"
  { text: 'Create Event', icon: <AddCircleOutlineIcon />, action: 'about' }, // 'about' action maps to Create Event
  { text: 'Analytics', icon: <BarChartRoundedIcon />, action: 'analytics' }, // New item for Analytics
];

const secondaryListItems = [
];

export default function MenuContent({ onMenuItemClick, selectedItem }) {
  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
      <List dense>
        {mainListItems.map((item) => ( // Changed key from index
          <ListItem key={item.action} disablePadding sx={{ display: 'block' }}>
            <ListItemButton 
              selected={selectedItem === item.action}
              onClick={() => onMenuItemClick && onMenuItemClick(item.action)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <List dense>
        {secondaryListItems.map((item) => ( // Changed key from index
          <ListItem key={item.action} disablePadding sx={{ display: 'block' }}>
            <ListItemButton 
              selected={selectedItem === item.action}
              onClick={() => onMenuItemClick && onMenuItemClick(item.action)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}