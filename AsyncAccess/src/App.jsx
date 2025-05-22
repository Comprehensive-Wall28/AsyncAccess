import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import MainLayout from './components/MainLayout';
import Home from './home-page/Home';
import SignIn from './sign-in/SignIn';
import SignUp from './sign-up/SignUp';
import Dashboard from './dashboard/Dashboard';

import Events from './events/Events';
import EventListing from './organizer-page/EventListing.jsx';
import EventAnalytics from './organizer-page/Details/EventAnalytics.jsx';
import BookingListing from "./booking-page/BookingListing.jsx";
import Checkout from "./booking-page/Checkout.jsx";
import Unauthorized from './unauthorized/Unauthorized';
import Unauthenticated from './unauthenticated/Unauthenticated';
import NotFound from './NotFound.jsx';
import RoledLogin from './sign-in-role/SignIn.jsx';
import RoledSignup from './sign-up-role/SignUp.jsx';
import ForgotPassword from './forgot-password/ForgotPassword.jsx';
import DashboardAdmin from './dashboard-admin/Dashboard.jsx';
import OrganizerDashboard from './organizer-page/EventListing.jsx';
import EventsPage from './events/Events';
import EventDetails from './events/components/EventDetails';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/marketing" element={<Home />} />
                <Route path="/events" element={<EventsPage />} />
                <Route path="/events/:id" element={<EventDetails />} />

                <Route
                    path="/dashboard"
                    element={
                        <MainLayout>
                            <Dashboard />
                        </MainLayout>
                    }
                />

                <Route
                    path="/organizer-management"
                    element={
                        <MainLayout>
                            <OrganizerDashboard />
                        </MainLayout>
                    }
                />

                <Route
                    path="/bookings"
                    element={
                        <MainLayout>
                            <BookingListing />
                        </MainLayout>
                    }
                />

                <Route
                    path="/checkout"
                    element={
                        <MainLayout>
                            <Checkout />
                        </MainLayout>
                    }
                />

                <Route path="/events-analytics/:id" element={<EventAnalytics />} />
                <Route path="/login-roled" element={<RoledLogin />} />
                <Route path="/signup-roled" element={<RoledSignup />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />

                <Route
                    path="/dashboard-admin"
                    element={
                        <MainLayout>
                            <DashboardAdmin />
                        </MainLayout>
                    }
                />

                <Route path="/unauthorized" element={<Unauthorized />} />
                <Route path="/unauthenticated" element={<Unauthenticated />} />

                {/* Catch-all route */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
}

export default App;