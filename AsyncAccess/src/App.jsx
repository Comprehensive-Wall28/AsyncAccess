import React from 'react';

import MainLayout from './components/MainLayout';
import Home from './home-page/Home';
import SignIn from './sign-in/SignIn';
import SignUp from './sign-up/SignUp';
import Dashboard from './dashboard/Dashboard';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Events from './events/Events'
import EventListing from './organizer-page/EventListing.jsx';
import EventAnalytics from './organizer-page/Details/EventAnalytics.jsx';
import BookingListing from "./bookings-page/BookingListing.jsx";
import Unauthorized from './unauthorized/Unauthorized';
import Unauthenticated from './unauthenticated/Unauthenticated';
import NotFound from './NotFound.jsx';
import RoledLogin from './sign-in-role/SignIn.jsx'
import RoledSignup from './sign-up-role/SignUp.jsx'
import ForgotPassword from './forgot-password/ForgotPassword.jsx';

function App() {
  return (
    <Router>
      <Routes>

          <Route
          path="/"
          element={<Home />}
        />
          <Route
          path="/login"
          element={<SignIn />}
        />
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

          <Route
          path="/dashboard"
          element={
            <MainLayout>
              {/* Replace HomePageContent with your actual dashboard component later */}
            </MainLayout>
          }
        />
        


          {/*<Route path="/organizer-management" element={<OrganizerDashboard />} />*/}
          <Route path="/events" element={<EventListing />} />
          <Route path="/bookings" element={<BookingListing />} />
          {/*<Route path="events/:id" element={<EventAnalytics />} />*/}
          <Route path="/login-roled" element={<RoledLogin />} />
          <Route path="/signup-roled" element={<RoledSignup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

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
