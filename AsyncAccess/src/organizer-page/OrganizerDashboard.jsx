import React, { useEffect, useState } from 'react';
import axios from 'axios';


function OrganizerDashboard() {
    const [events, setEvents] = useState([]);
    const [analytics, setAnalytics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const [eventsRes, analyticsRes] = await Promise.all([
                    axios.get('/api/v1/users/events', { withCredentials: true }),
                    axios.get('/api/v1/users/events/analytics', { withCredentials: true }),
                ]);
                setEvents(Array.isArray(eventsRes.data) ? eventsRes.data : []);
                setAnalytics(Array.isArray(analyticsRes.data) ? analyticsRes.data : []);
            } catch (err) {
                setError('Failed to load dashboard data.');
                console.error('Error fetching data:', err);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div style={{ color: 'red' }}>{error}</div>;

    return (
        <div>
            <h2>My Events</h2>
            <ul>
                {Array.isArray(events) && events.length > 0 ? (
                    events.map(event => (
                        <li key={event._id || event.id || Math.random()}>
                            {event.title} - {event.status}
                        </li>
                    ))
                ) : (
                    <li>No events found.</li>
                )}
            </ul>
            <h2>Event Analytics</h2>
            <ul>
                {Array.isArray(analytics) && analytics.length > 0 ? (
                    analytics.map(a => (
                        <li key={a.eventId || a.id || Math.random()}>
                            {a.title}: {a.ticketsSold} tickets sold ({a.percentageSold}%)
                        </li>
                    ))
                ) : (
                    <li>No analytics found.</li>
                )}
            </ul>
        </div>
    );
}

export default OrganizerDashboard;