import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import OrganizerDashboard from './organizerPage/Dashboard.jsx';
import Home from './home-page/Home';
import SignIn from './sign-in/SignIn';
import SignUp from './sign-up/SignUp';
import Dashboard from './dashboard/Dashboard';
import EventAnalytics from './organizerPage/Analytics/EventAnalytics'

import EventAnalytics from './event-analytics/Details/EventAnalytics.jsx';
//import BookingListing from "./bookings-page/BookingListing.jsx";
import Unauthorized from './unauthorized/Unauthorized';
import Unauthenticated from './unauthenticated/Unauthenticated';
import NotFound from './NotFound.jsx';
import RoledLogin from './sign-in-role/SignIn.jsx'
import RoledSignup from './sign-up-role/SignUp.jsx'
import ForgotPassword from './forgot-password/ForgotPassword.jsx';
import DashboardAdmin from './dashboard-admin/Dashboard.jsx'

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
          element={<Dashboard />}
        />
        
        <Route path="/dashboard-organizer" element={<OrganizerDashboard />} />
        <Route path="/login-roled" element={<RoledLogin />} />
        <Route path="/signup-roled" element={<RoledSignup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/dashboard-admin" element={<DashboardAdmin />} />
        <Route path="/dashboard-organizer/:id" element={<EventAnalytics />} />


          <Route
            path="/unauthorized"
            element={<Unauthorized />}
          />
          <Route
            path="/unauthenticated"
            element={<Unauthenticated />}
          />

        {/* DONT PLACE BELOW HERE!*/}
         <Route path="*" element={<NotFound />} /> {/* Catch-all route */}
        </Routes>
      </Router>
  );
}

export default App;