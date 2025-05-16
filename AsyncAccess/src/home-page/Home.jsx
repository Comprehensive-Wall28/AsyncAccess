import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import AppTheme from '../shared-theme/AppTheme';
import AppAppBar from './components/AppAppBar';
import Hero from './components/Hero';
import LogoCollection from './components/LogoCollection';
import Highlights from './components/Highlights';
import Pricing from './components/Pricing';
import Events from './components/Events';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import Footer from './components/Footer';

export default function Home(props) {
  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <AppAppBar />
      <Hero />
      <div>
        <LogoCollection />
        {/* <Events /> */}
        {/* <Divider /> */}
        {/* <Testimonials /> */}
        {/* <Divider /> */}
        {/* <Highlights /> */}
        <Divider />
        {/* <Pricing /> */}
        <Divider />
        {/* <FAQ /> */}
        <Divider />
        <Footer />
      </div>
    </AppTheme>
  );
}
