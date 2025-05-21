import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import AppTheme from '../shared-theme/AppTheme';
import AppAppBar from '../home-page/components/AppAppBar';
import Hero from './components/Hero';
import Footer from './components/Footer';

export default function Home(props) {
  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <AppAppBar />
      <Hero />
      <div>
        <Divider />
        <Footer />
      </div>
    </AppTheme>
  );
}
