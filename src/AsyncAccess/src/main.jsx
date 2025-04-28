import React from 'react';
import { createRoot } from 'react-dom/client';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles'; // Import createTheme here
import App from './App'; 

// 1. Create the dark theme instance
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    {/* 2. Apply the theme provider ONCE, here at the root */}
    <ThemeProvider theme={darkTheme}>
      {/* CssBaseline applies global resets and background */}
      <CssBaseline />
      <App /> {/* Render your App component */}
    </ThemeProvider>
  </React.StrictMode>,
);