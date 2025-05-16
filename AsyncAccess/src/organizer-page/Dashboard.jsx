// AsyncAccess/src/organizer-page/Dashboard.jsx
import './css/style.css';
import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

function OrganizerDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/v1/events');
        if (!response.ok) {
          throw new Error(`Server responded with status ${response.status}`);
        }
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new TypeError("Response wasn't JSON");
        }
        const data = await response.json();
        setBookings(data);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  return (
      <div className="organizer-dashboard">
        <h1>Organizer Dashboard</h1>
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
                        key={booking.id}
                        className="booking-box"
                        onClick={() => navigate(`/bookings/${booking._id}`)}                    >
                      <div className="booking-header">
                        <h3>{booking.title || 'Untitled Event'}</h3>
                      </div>
                      <div className="booking-details">
                        {booking.date && (
                            <p>
                              <span className="detail-label">Date:</span>
                              <span>{new Date(booking.date).toLocaleDateString()}</span>
                            </p>
                        )}
                        {booking.time && (
                            <p>
                              <span className="detail-label">Time:</span>
                              <span>{booking.time}</span>
                            </p>
                        )}
                        {booking.location && (
                            <p>
                              <span className="detail-label">Location:</span>
                              <span>{booking.location}</span>
                            </p>
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
}

export default OrganizerDashboard;