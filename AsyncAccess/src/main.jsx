import React from 'react';
import { createRoot } from 'react-dom/client';
import CssBaseline from '@mui/material/CssBaseline';
import AppTheme from './shared-theme/AppTheme'; // Import AppTheme
import App from './App'; 

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    {/* Use AppTheme as the top-level theme provider */}
    <AppTheme> 
      <CssBaseline enableColorScheme />
      <App /> 
    </AppTheme>
  </React.StrictMode>,
);