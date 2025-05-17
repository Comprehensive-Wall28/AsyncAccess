import './components/EventListings.css';
import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClock,
  FaTicketAlt,
  FaChartBar
} from 'react-icons/fa';

function EventListing() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Use the endpoint that was working in the original code
        const response = await fetch('http://localhost:3000/api/v1/users/events', {
          credentials: 'include', // Include credentials for auth
          headers: {
            'Content-Type': 'application/json',
            // Add auth header if you have a token
            // 'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) throw new Error(`Status ${response.status}`);
        const data = await response.json();
        setEvents(data);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="organizer-dashboard">
      <h1>Organizer Dashboard</h1>
      <div className="events-container">
        <h2>All Events</h2>
        {loading ? (
          <div className="loading-box">Loading events...</div>
        ) : error ? (
          <div className="error-box">
            <h3>Error Loading Events</h3>
            <p>{error}</p>
          </div>
        ) : events.length === 0 ? (
          <div className="empty-box">No events available</div>
        ) : (
          <div className="events-grid">
            {events.map((event) => (
              <div
                key={event._id}
                className="event-card"
              >
                <div className="event-header">
                  {event.category && (
                    <span className="category-tag">{event.category}</span>
                  )}
                </div>
                <h3 className="event-title">{event.title || 'Untitled Event'}</h3>
                <span className={`status-badge ${event.status?.toLowerCase()}`}>
                  {event.status}
                </span>
                <div className="event-info">
                  {event.date && (
                    <div className="info-item">
                      <FaCalendarAlt className="info-icon" />
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                    </div>
                  )}
                  {event.time && (
                    <div className="info-item">
                      <FaClock className="info-icon" />
                      <span>{event.time}</span>
                    </div>
                  )}
                  {event.location && (
                    <div className="info-item">
                      <FaMapMarkerAlt className="info-icon" />
                      <span>{event.location}</span>
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
}

export default EventListing;