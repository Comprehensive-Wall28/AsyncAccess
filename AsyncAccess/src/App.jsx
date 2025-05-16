import React from 'react';

import MainLayout from './components/MainLayout';
import Home from './home-page/Home';
import SignIn from './sign-in/SignIn';
import SignUp from './sign-up/SignUp';
import Dashboard from './dashboard/Dashboard';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import OrganizerDashboard from './organizer-page/Dashboard';
import BookingsDetail from './organizer-page/Details/BookingsDetail.jsx';

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
          path="/dashboard"
          element={
            <MainLayout>
              {/* Replace HomePageContent with your actual dashboard component later */}
            </MainLayout>
          }
        />


          {/*<Route path="/organizer-management" element={<OrganizerDashboard />} />*/}
          <Route path="/bookings" element={<OrganizerDashboard />} />
          <Route path="bookings/:id" element={<BookingsDetail />} />

        {/* Add more routes for other pages here */}

      </Routes>
    </Router>
  );
}

export default App;
