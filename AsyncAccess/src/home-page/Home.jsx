import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import AppTheme from '../shared-theme/AppTheme';
import AppAppBar from './components/AppAppBar';
import Hero from './components/Hero';
import Footer from './components/Footer';
import FeaturedEvents from './components/FeaturedEvents'; // Import the new component

export default function Home(props) {
  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <AppAppBar />
      <Hero />
      <Divider />
      <FeaturedEvents /> {/* Add the new component here */}
      <div>
        <Divider />
        <Footer />
      </div>
    </AppTheme>
  );
}
