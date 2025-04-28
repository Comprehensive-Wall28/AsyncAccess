import React from 'react';
import { createRoot } from 'react-dom/client';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import App from './App';

// --- Dracula Color Palette ---
// Reference: https://draculatheme.com/contribute
const draculaPalette = {
  background: '#282a36', // Background
  currentLine: '#44475a', // Current Line (Good for Paper/Cards/AppBar)
  foreground: '#f8f8f2', // Foreground (Main text)
  comment: '#6272a4', // Comment (Secondary text, borders, dividers)
  cyan: '#8be9fd', // Cyan (Info)
  green: '#50fa7b', // Green (Success)
  orange: '#ffb86c', // Orange (Warning)
  pink: '#ff79c6', // Pink (Secondary Action)
  purple: '#bd93f9', // Purple (Primary Action)
  red: '#ff5555', // Red (Error)
  yellow: '#f1fa8c', // Yellow
};

// Create the theme using Dracula colors
const draculaTheme = createTheme({
  palette: {
    mode: 'dark', // Keep mode as dark
    primary: {
      main: draculaPalette.purple, // Use Purple for primary actions
      contrastText: draculaPalette.background, // Ensure text on primary is readable
    },
    secondary: {
      main: draculaPalette.pink, // Use Pink for secondary actions
      contrastText: draculaPalette.background, // Ensure text on secondary is readable
    },
    error: {
      main: draculaPalette.red,
      contrastText: draculaPalette.background,
    },
    warning: {
      main: draculaPalette.orange,
      contrastText: draculaPalette.background,
    },
    info: {
      main: draculaPalette.cyan,
      contrastText: draculaPalette.background,
    },
    success: {
      main: draculaPalette.green,
      contrastText: draculaPalette.background,
    },
    text: {
      primary: draculaPalette.foreground, // Main text color
      secondary: draculaPalette.comment, // Secondary text color
      disabled: draculaPalette.comment, // Disabled text color (can adjust opacity if needed)
    },
    background: {
      default: draculaPalette.background, // Main page background
      paper: draculaPalette.currentLine, // Background for Paper, Card, AppBar(elevation=0) etc.
    },
    divider: draculaPalette.comment, // Color for dividers and borders
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif', // Keep your font or change if desired
    // You might want to adjust default font colors if needed, but text palette usually handles it
  },
  // Optional: Customize component defaults further if needed
  components: {
    // Example: Ensure Paper background is explicitly set if needed elsewhere
    // MuiPaper: {
    //   styleOverrides: {
    //     root: {
    //       backgroundColor: draculaPalette.currentLine,
    //     }
    //   }
    // },
    // Example: Ensure AppBar uses the correct background from the theme
    MuiAppBar: {
       styleOverrides: {
         // Ensure AppBars using color="default" or "inherit" pick up the paper background
         // You might need to adjust this based on how you set AppBar color in MainLayout
         // colorDefault: {
         //   backgroundColor: draculaPalette.currentLine,
         // },
         // colorInherit: {
         //   backgroundColor: draculaPalette.currentLine,
         // }
       }
     }
  }
});

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    {/* Use the new Dracula theme */}
    <ThemeProvider theme={draculaTheme}>
      {/* CssBaseline applies global resets and theme's background.default */}
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>,
);
