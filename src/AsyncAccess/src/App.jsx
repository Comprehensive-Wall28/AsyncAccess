import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import your layout and page components
import MainLayout from './components/MainLayout';
import HomePageContent from './pages/HomePageContent'; // Keep this if you might use it elsewhere
import Home from './home-page/Home'; // Import the Home component

function App() {
  return (
    // Router should wrap the entire application content
    <Router>
      {/* Routes defines the different paths */}
      <Routes>
        {/* --- Updated Route for the root path --- */}
        {/* This route now renders the Home component directly */}
        <Route
          path="/" // Define the path for the home page
          element={<Home />} // Render the Home component
        />
        {/* --- End Updated Route --- */}


        {/* Route for the Marketing Page (Optional: Keep as an alias or remove) */}
        {/* This path also renders the Home component */}
        <Route
          path="/marketing" // Define the path for the marketing page
          element={<Home />} // Render the Home component
        />

        {/* Add routes for other pages that *should* use MainLayout */}
        {/* Example: A dashboard page using the original layout */}
        <Route
          path="/dashboard"
          element={
            <MainLayout>
              {/* Replace HomePageContent with your actual dashboard component later */}
              <HomePageContent />
            </MainLayout>
          }
        />

        {/* Add more routes for other pages here */}

      </Routes>
    </Router>
  );
}

export default App;
