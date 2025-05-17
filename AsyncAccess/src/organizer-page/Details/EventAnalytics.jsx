import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt } from 'react-icons/fa';
import './style.css';

function EventAnalytics() {
    const { id } = useParams();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/v1/events/${id}`);
                if (!response.ok) throw new Error(`Server responded with status ${response.status}`);
                const contentType = response.headers.get('content-type');
                if (!contentType?.includes('application/json')) throw new TypeError("Response wasn't JSON");
                const data = await response.json();
                setBooking(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchBooking();
    }, [id]);

    if (loading) return <div className="loading-box">Loading event...</div>;
    if (error) return <div className="error-box"><h3>Error Loading Event</h3><p>{error}</p></div>;
    if (!booking) return <div className="empty-box">Event not found</div>;

    return (
        <div className="booking-card">
            <h1 className="event-title">{booking.title || 'Untitled Event'}</h1>

            <div className="details-grid">
                <div className="details-column">
                    {booking.date && (
                        <div className="detail-item">
                            <FaCalendarAlt className="icon" />
                            <span>{new Date(booking.date).toLocaleDateString()}</span>
                        </div>
                    )}
                    {booking.time && (
                        <div className="detail-item">
                            <FaClock className="icon" />
                            <span>{booking.time}</span>
                        </div>
                    )}
                    {booking.location && (
                        <div className="detail-item">
                            <FaMapMarkerAlt className="icon" />
                            <span>{booking.location}</span>
                        </div>
                    )}
                    {booking.image && (
                        <div className="detail-item">
                          {booking.image && (
                            <div className="image-container">
                              <div className="image-loader"></div>
                              <img
                                src={booking.image}
                                alt="Event"
                                className="event-image"
                                onLoad={(e) => e.target.classList.add('loaded')}
                                onError={(e) => {
                                  // Hide the loader when image fails to load
                                  const loader = e.target.previousElementSibling;
                                  if (loader) loader.style.display = 'none';

                                  // Hide the image and show the error message
                                  e.target.style.display = 'none';
                                  e.target.nextElementSibling.style.display = 'block';
                                }}
                              />
                              <div className="image-error">Failed to load image!</div>
                            </div>
                          )}
                        </div>
                    )}

                </div>

                <div className="details-column">
                    {booking.ticketPrice && (
                        <div className="detail-row">
                            <strong>Ticket Price:</strong> <span>${booking.ticketPrice}</span>
                        </div>
                    )}
                    {booking.totalTickets && (
                        <div className="detail-row">
                            <strong>Total Tickets:</strong> <span>{booking.totalTickets}</span>
                        </div>
                    )}
                    {booking.bookedTickets && (
                        <div className="detail-row">
                            <strong>Booked Tickets:</strong> <span>{booking.bookedTickets}</span>
                        </div>
                    )}
                    {booking.status && (
                        <div className="detail-row">
                            <strong>Status:</strong> <span className={`status-badge ${booking.status.toLowerCase()}`}>{booking.status}</span>
                        </div>
                    )}
                </div>
            </div>

            {booking.category && (
                <div className="themes">
                    <strong>Themes:</strong>
                    <div className="theme-badges">
                        {String(booking.category).split(',').map((theme, index) => (
                            <span key={index} className="theme-badge">{theme.trim()}</span>
                        ))}
                    </div>
                </div>
            )}

            <div className="description">
                <strong>Description:</strong>
                <p>{booking.description || 'No description provided.'}</p>
            </div>
        </div>
    );
}

export default EventAnalytics;
