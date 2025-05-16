// AsyncAccess/src/organizer-page/Event-Handling/BookingsDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './style.css';

function BookingsDetail() {
    const { id } = useParams();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/v1/events/${id}`);
                if (!response.ok) {
                    throw new Error(`Server responded with status ${response.status}`);
                }
                const contentType = response.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) {
                    throw new TypeError("Response wasn't JSON");
                }
                const data = await response.json();
                setBooking(data);
            } catch (err) {
                console.error('Fetch error:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchBooking();
    }, [id]);

    if (loading) {
        return <div className="loading-box">Loading event...</div>;
    }

    if (error) {
        return (
            <div className="error-box">
                <h3>Error Loading Event</h3>
                <p>{error}</p>
            </div>
        );
    }

    if (!booking) {return <div className="empty-box">Event not found</div>;}

    return (
        <div className="booking-detail">
            <h2>{booking.title || 'Untitled Event'}</h2>

            {booking.date && <p><strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}</p>}
            {booking.time && <p><strong>Time:</strong> {booking.time}</p>}
            {booking.location && <p><strong>Location:</strong> {booking.location}</p>}
            {booking.category && <p><strong>Themes:</strong> {booking.category}</p>}
            {booking.ticketPrice && <p><strong>Ticket Price:</strong> {booking.ticketPrice}</p>}
            {booking.totalTickets && <p><strong>Total Tickets:</strong> {booking.totalTickets}</p>}
            {booking.bookedTickets && <p><strong>Booked Tickets:</strong> {booking.bookedTickets}</p>}
            {booking.status && <p><strong>Status:</strong> {booking.status}</p>}
            {/*{booking.createdDate && <p><strong>created date:</strong> {new Date(booking.createdDate).toLocaleDateString()}</p>}*/}
            <p><strong>Description:</strong> {booking.description || 'No description provided'}</p>
        </div>
    );
}

export default BookingsDetail;