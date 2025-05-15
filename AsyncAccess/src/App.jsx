import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import MainLayout from './components/MainLayout';
import Home from './home-page/Home';
import OrganizerDashboard from "./organizer-page/OrganizerDashboard.jsx";
import SignIn from './sign-in/SignIn';
import SignUp from './sign-up/SignUp';
import Dashboard from './dashboard/Dashboard';


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

        {/* Add more routes for other pages here */}

      </Routes>
    </Router>
  );
}

export default App;
