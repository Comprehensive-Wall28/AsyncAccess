import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Home from './home-page/Home';
import SignIn from './sign-in/SignIn';
import SignUp from './sign-up/SignUp';
import Dashboard from './dashboard/Dashboard';

import Events from './events/Events'

import BookingListing from "./booking-page/Checkout.jsx";
import Unauthorized from './unauthorized/Unauthorized';
import Unauthenticated from './unauthenticated/Unauthenticated';
import NotFound from './NotFound.jsx';
import RoledSignup from './sign-up-role/SignUp.jsx'
import ForgotPassword from './forgot-password/ForgotPassword.jsx';
import DashboardAdmin from './dashboard-admin/Dashboard.jsx'
import OrganizerDashboard from './organizerPage/Dashboard.jsx';
import EventsPage from './events/Events'; // Assuming 'Events.jsx' is the page wrapper
import EventDetails from './events/components/EventDetails'; // Corrected import path
import VerifyEmail from './verify-email/VerifyEmail.jsx'; // Import the VerifyEmail component
import MfaVerify from './mfa-verify/MfaVerify.jsx'; // Import the MfaVerify component


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
                    path="/verify-email" 
                    element={<VerifyEmail />} />
                <
                    Route
                    path="/mfa-verify" // Add route for MFA verification
                    element={<MfaVerify />} />
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
                <Route
                    path="/signup"
                    element={<SignUp />}
                />
                <Route
                    path="/marketing"
                    element={<Home />}
                />
                <Route
                    path="/events"
                    element={<Events />}
                />


                <Route path="/dashboard-organizer" element={<OrganizerDashboard />} />

                {/*<Route path="/organizer-management" element={<OrganizerDashboard />} />*/}

                <Route path="/bookings" element={<BookingListing />} />
                {/*<Route path="events/:id" element={<EventAnalytics />} />*/}
  
                <Route path="/signup-roled" element={<RoledSignup />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/dashboard-admin" element={<DashboardAdmin />} />


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