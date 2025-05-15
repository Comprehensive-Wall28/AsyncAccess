import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import MainLayout from './components/MainLayout';
import Home from './home-page/Home';
import OrganizerDashboard from "./organizer-page/OrganizerDashboard.jsx";
import SignIn from './sign-in/SignIn';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<SignIn />} />
                <Route path="/marketing" element={<Home />} />

                <Route
                    path="/dashboard"
                    element={
                        <MainLayout>
                            {/* You can replace this with a general dashboard page */}
                        </MainLayout>
                    }
                />

                <Route
                    path="/organizer/dashboard"
                    element={
                        <MainLayout>
                            <div style={{ color: 'red' }}>Test: Organizer Dashboard Route</div>
                            <OrganizerDashboard />
                        </MainLayout>
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;
