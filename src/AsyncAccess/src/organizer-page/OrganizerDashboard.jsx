// src/pages/OrganizerDashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function OrganizerDashboard() {
    const [events, setEvents] = useState([]);
    const [analytics, setAnalytics] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const [eventsRes, analyticsRes] = await Promise.all([
                    axios.get('/api/v1/users/events', { withCredentials: true }),
                    axios.get('/api/v1/users/events/analytics', { withCredentials: true }),
                ]);
                setEvents(eventsRes.data);
                setAnalytics(analyticsRes.data);
            } catch (err) {
                // Handle error
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h2>My Events</h2>
            <ul>
                {events.map(event => (
                    <li key={event._id}>{event.title} - {event.status}</li>
                ))}
            </ul>
            <h2>Event Analytics</h2>
            <ul>
                {analytics.map(a => (
                    <li key={a.eventId}>
                        {a.title}: {a.ticketsSold} tickets sold ({a.percentageSold}%)
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default OrganizerDashboard;