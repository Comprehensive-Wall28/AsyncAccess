import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import MainLayout from './components/MainLayout';
import Home from './home-page/Home';
import SignIn from './sign-in/SignIn';
import SignUp from './sign-up/SignUp';
import Dashboard from './dashboard/Dashboard';
import OrganizerDashboard from './organizer-page/Dashboard';
import EventsPage from './events/Events'; // Assuming 'Events.jsx' is the page wrapper
import EventDetails from './events/components/EventDetails'; // Corrected import path

function App() {
  return (
      <Router>
        <Routes>
          <
            Route
            path="/"
            element={<Home />} />
          <
            Route
            path="/login"
            element={<SignIn />} />
          <
            Route
            path="/signup"
            element={<SignUp />} />
          <
            Route
            path="/marketing"
            element={<Home />} />
          <
            Route
            path="/events"
            element={<EventsPage />} />
          <
            Route
            path="/events/:id"
            element={<EventDetails />} />

          <Route
          path="/dashboard"
          element={<Dashboard />} />

          <Route
          path="/organizer-management"
          element={<OrganizerDashboard />} />
          {/* Add more routes for other pages here */}
        </Routes>
      </Router>
  );
}

export default App;