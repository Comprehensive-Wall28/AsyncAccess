import './components/EventListings.css';
import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import NotFound from '../components/NotFoundComponent';
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClock
} from 'react-icons/fa';
import { apiClient } from "../services/authService.js";

function EventListing() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const userRole = user?.role ?? null;
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.get('/users/profile');
        setCurrentUser(response.data);

        if (response.data.role === 'User') {
          setNotFound(true);
          return;
        }

        const eventsResponse = await fetch('http://localhost:3000/api/v1/users/events', {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        });

        if (!eventsResponse.ok) {
          setError('Events not found');
          setLoading(false);
          return;
        }

        const data = await eventsResponse.json();
        setEvents(data);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user.role, userRole]);

  if (notFound) {
    return <NotFound />;
  }

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