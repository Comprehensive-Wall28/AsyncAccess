import React from 'react';
// Removed ThemeProvider and createTheme imports from here
import CssBaseline from '@mui/material/CssBaseline'; // Keep CssBaseline if you want its resets applied globally via index.js
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';

// Your main application component
// It no longer creates or provides the theme itself
function App() {
  return (
    // ThemeProvider is removed from here. It should wrap <App /> in your index.js
    <>
      {/* CssBaseline should also ideally be applied once in index.js */}
      {/* <CssBaseline /> */}
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Dark Theme App
            </Typography>
            <Button color="inherit">Login</Button>
          </Toolbar>
        </AppBar>
        <Box sx={{ p: 3 }}> {/* Add some padding */}
          <Typography variant="h4" gutterBottom>
            Welcome to the Dark Side!
          </Typography>
          <Typography paragraph>
            This application content will now receive the theme (like dark mode)
            from the ThemeProvider wrapping it in your main entry file (e.g., index.js).
          </Typography>
          <Button variant="contained" color="primary" sx={{ mr: 1 }}>
            Primary Button
          </Button>
          <Button variant="contained" color="secondary">
            Secondary Button
          </Button>
        </Box>
      </Box>
    </>
    // ThemeProvider closing tag removed
  );
}

export default App;
