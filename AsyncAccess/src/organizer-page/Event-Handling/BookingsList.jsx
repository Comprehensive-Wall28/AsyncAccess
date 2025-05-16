import { useState, useEffect } from 'react';

function BookingsList() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/v1/events');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setBookings(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []); // Empty dependency array means this runs once on mount

    if (loading) return <div>Loading bookings...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="bookings-container">
            <h2>Your Bookings</h2>
            {bookings.length === 0 ? (
                <p>No bookings found</p>
            ) : (
                <ul className="bookings-list">
                    {bookings.map((booking) => (
                        <li key={booking.id} className="booking-item">
                            <h3>{booking.title}</h3>
                            <p>Date: {new Date(booking.date).toLocaleDateString()}</p>
                            <p>Time: {booking.time}</p>
                            {/* Add more booking details as needed */}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default BookingsList;