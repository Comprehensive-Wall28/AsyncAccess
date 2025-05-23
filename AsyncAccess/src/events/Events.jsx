import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import AppTheme from '../shared-theme/AppTheme';
import AppAppBar from '../home-page/components/AppAppBar';
import Hero from './components/Hero';
import Footer from '../home-page/components/Footer';
import AllEventsDisplay from './components/Events'; // Import the modified component

export default function Home(props) {
    return (
        <AppTheme {...props}>
            <CssBaseline enableColorScheme />
            <AppAppBar />
            <Hero />
            
            <AllEventsDisplay />
            <div>
                <Divider sx={{ mt: {xs: 4, sm: 8} }}/>
                <Footer />
            </div>
        </AppTheme>
    );
}
