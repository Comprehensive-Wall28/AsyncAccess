import React from 'react';

import MainLayout from './components/MainLayout';
import OrganizerDashboard from './organizerPage/Dashboard.jsx';
import Home from './home-page/Home';
import SignIn from './sign-in/SignIn';
import SignUp from './sign-up/SignUp';
import Dashboard from './dashboard/Dashboard';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Events from './events/Events';

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

        <Route path="/dashboard-organizer" element={<OrganizerDashboard />} />
        <Route path="/dashboard" element={<MainLayout></MainLayout>} />

        {/* Add more routes for other pages here */}

      </Routes>
    </Router>
  );
}

export default App;
