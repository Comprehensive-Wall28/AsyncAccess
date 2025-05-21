import * as React from "react";
import * as bookingsService from "../../services/bookingsService.js";

export function useUserBookings(currentUser) {
  const [bookings, setBookings] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    if (!currentUser) {
      setBookings([]);
      setError('');
      setIsLoading(false);
      return;
    }

    console.log('wsg')

      if (currentUser == 'User') {
          console.log('hai')
          useUserBookings
          const fetchUserBookings = async () => {
            setIsLoading(true);
            setError('');
            try {
              const data = await bookingsService.getMyBookings();
              setBookings(data);
            } catch (err) {
              // The backend returns 404 with a specific error message for no bookings
              if (err && err.status === 404 && err.data && err.data.error === "No bookings found for this user") {
                setBookings([]); // This is an expected "empty" state
              } else if (err && err.data && err.data.error) { // Other errors from our backend
                setError(err.data.error);
                setBookings([]);
              } else if (err && err.message) { // Network errors or other generic errors
                setError(err.message);
                setBookings([]);
              } else {
                setError('An error occurred while fetching bookings.');
                setBookings([]);
              }
            } finally {
              setIsLoading(false);
            }
          };

          fetchUserBookings();
      }
  }, [currentUser]);


    /*setIsLoading(true);
    setError('');
    bookingsService.getMyBookings()
      .then(data => setBookings(data))
      .catch(err => {
        if (err && err.status === 404 && err.data?.error === "No bookings found for this user") {
          setBookings([]);
        } else if (err && err.data?.error) {
          setError(err.data.error);
          setBookings([]);
        } else if (err && err.message) {
          setError(err.message);
          setBookings([]);
        } else {
          setError('An error occurred while fetching bookings.');
          setBookings([]);
        }
      })
      .finally(() => setIsLoading(false));
  }, [currentUser]);*/

  return { bookings, isLoading, error, setBookings };
}