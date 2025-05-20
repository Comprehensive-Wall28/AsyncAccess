import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import AppTheme from '../shared-theme/AppTheme';
import AppAppBar from './components/AppAppBar';
import Hero from './components/Hero';
import Footer from './components/Footer';
import AllEventsDisplay from './components/Events'; // Import the modified component

// The file exports 'Home', you might consider renaming it to 'EventsPage' for clarity,
// but I'll keep 'Home' if it's referenced elsewhere by that name.
export default function Home(props) {
    return (
        <AppTheme {...props}>
            <CssBaseline enableColorScheme />
            <AppAppBar />
            <Hero />
            {/* Render the events list after the Hero section */}
            <AllEventsDisplay />
            <div>
                <Divider sx={{ mt: {xs: 4, sm: 8} }}/>
                <Footer />
            </div>
        </AppTheme>
    );
}