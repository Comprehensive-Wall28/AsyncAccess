import * as React from 'react';
import Box from '@mui/material/Box';
import Copyright from '../internals/components/Copyright';

import UserProfileDisplay from './UserProfileDisplay';
import {FaCalendarAlt, FaClock, FaMapMarkerAlt} from "react-icons/fa";
import {Outlet} from "react-router-dom";
import {useState} from "react"; // Import the new component

export default function MainGrid() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [notFound, setNotFound] = useState(false);
    const user = JSON.parse(localStorage.getItem('user')) || {};
    const userRole = user?.role ?? null;
    const [currentUser, setCurrentUser] = useState(null);

    return (
        <div className="organizer-dashboard">
            <h1>Bookings</h1>
            <div className="bookings-container">
                <h2>All Bookings</h2>
                {loading ? (
                    <div className="loading-box">Loading bookings...</div>
                ) : error ? (
                    <div className="error-box">
                        <h3>Error Loading Bookings</h3>
                        <p>{error}</p>
                    </div>
                ) : bookings.length === 0 ? (
                    <div className="empty-box">No bookings available</div>
                ) : (
                    <div className="bookings-grid">
                        {bookings.map((booking) => (
                            <div
                                key={booking._id}
                                className="booking-card"
                            >
                                <div className="booking-header">
                                    {booking.category && (
                                        <span className="category-tag">{booking.category}</span>
                                    )}
                                </div>
                                <h3 className="booking-title">{booking.title || 'Untitled Booking'}</h3>
                                <span className={`status-badge ${booking.status?.toLowerCase()}`}>
                  {booking.status}
                </span>
                                <div className="booking-info">
                                    {booking.date && (
                                        <div className="info-item">
                                            <FaCalendarAlt className="info-icon" />
                                            <span>{new Date(booking.date).toLocaleDateString()}</span>
                                        </div>
                                    )}
                                    {booking.time && (
                                        <div className="info-item">
                                            <FaClock className="info-icon" />
                                            <span>{booking.time}</span>
                                        </div>
                                    )}
                                    {booking.location && (
                                        <div className="info-item">
                                            <FaMapMarkerAlt className="info-icon" />
                                            <span>{booking.location}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Outlet />
        </div>
    );
    /*return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      {/!* User Profile Section *!/}


      <Copyright sx={{ my: 4 }} />
    </Box>
  );*/
}
