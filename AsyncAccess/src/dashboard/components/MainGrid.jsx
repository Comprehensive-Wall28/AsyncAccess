import Box from '@mui/material/Box';
import Copyright from '../internals/components/Copyright';
import UserProfileDisplay from './UserProfileDisplay'; 
import UserBookingsDisplay from './UserBookingsDisplay';
import UserEventsDisplay from './UserEventsDisplay'

export default function MainGrid({ currentUser, isLoading, setCurrentUser }) {
  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      {/* User Profile Section */}
      <UserProfileDisplay currentUser={currentUser} isLoading={isLoading} setCurrentUser={setCurrentUser} />

      {/* User Bookings Section */}
      <UserBookingsDisplay currentUser={currentUser} />
        <UserEventsDisplay currentUser={currentUser} />

 
      <Copyright sx={{ my: 4 }} />
    </Box>
  );
}
