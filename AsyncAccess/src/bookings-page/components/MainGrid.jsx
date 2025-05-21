import * as React from 'react';
//import Box from '@mui/material/Box';
//import Copyright from '../internals/components/Copyright';

//import UserProfileDisplay from './UserProfileDisplay';
import {Outlet} from "react-router-dom";
import Footer from "../../components/Footer.jsx";

export default function MainGrid({bookings, loading, error, currentUser}) {

    return (
        <div className="booking-dashboard">
            <h1>Bookings</h1>
            <div className="bookings-container">
                <h2>All Bookings</h2>
                {loading ? (
                    <div className="bookLoad">Loading bookings...</div>
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

                                <h3 className="booking-title">{booking.event.title || 'Untitled Booking'}</h3>
                                <span className={`status-badge ${booking.status?.toLowerCase()}`}>
                                    {booking.status}
                                </span>
                                <div className="booking-info">
                                    {booking.event.date && (
                                        <div className="info-item">
                                            <FaCalendarAlt className="info-icon" />
                                            <span>{new Date(booking.event.date).toLocaleDateString()}</span>
                                        </div>
                                    )}
                                </div>
                                {booking.totalPrice && (
                                    <div className="info-item">
                                        <FaMapMarkerAlt className="info-icon" />
                                        <span>Total Price paid: {booking.totalPrice} USD</span>
                                    </div>
                                )}
                                {booking.numberOfTickets && (
                                    <div className="info-item">
                                        <FaMapMarkerAlt className="info-icon" />
                                        <span>No. of tickets: {booking.numberOfTickets}</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Outlet />
            <Footer />
        </div>
    );
}
