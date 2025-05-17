import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import AnalyticsRoundedIcon from '@mui/icons-material/AnalyticsRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import HelpRoundedIcon from '@mui/icons-material/HelpRounded';
import { apiClient } from "../../services/authService.js";

const secondaryListItems = [
    { text: 'Settings', icon: <SettingsRoundedIcon />, route: '/settings' },
    { text: 'About', icon: <InfoRoundedIcon />, route: '/about' },
    { text: 'Feedback', icon: <HelpRoundedIcon />, route: '/feedback' },
];

export default function MenuContent() {
    const [currentUser, setCurrentUser] = React.useState(null);
    const navigate = useNavigate();

    React.useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await apiClient.get('/users/profile');
                setCurrentUser(response.data);
            } catch {
                setCurrentUser(null);
            }
        };
        fetchUser();
    }, []);

    // Wait for user to load before rendering menu
    if (currentUser === null) {
        return null; // or a loading spinner
    }

    const book = currentUser.role === 'User' ? 'My Bookings' : 'My Events';
    const r = currentUser.role === 'User' ? '/bookings' : '/events';

    const mainListItems = [
        { text: 'Home', icon: <HomeRoundedIcon />, route: '/' },
        { text: book, icon: <AnalyticsRoundedIcon />, route: r },
        { text: 'Clients', icon: <PeopleRoundedIcon />, route: '/clients' },
        { text: 'Tasks', icon: <AssignmentRoundedIcon />, route: '/tasks' },
    ];

    const handleNavigation = (route) => {
        if (route) {
            navigate(route);
        }
    };

    return (
        <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
            <List dense>
                {mainListItems.map((item, index) => (
                    <ListItem key={index} disablePadding sx={{ display: 'block' }}>
                        <ListItemButton selected={index === 1} onClick={() => handleNavigation(item.route)}>
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <List dense>
                {secondaryListItems.map((item, index) => (
                    <ListItem key={index} disablePadding sx={{ display: 'block' }}>
                        <ListItemButton onClick={() => handleNavigation(item.route)}>
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Stack>
    );
}