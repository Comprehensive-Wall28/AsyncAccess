import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import Alert from '@mui/material/Alert'; // Import Alert for displaying errors
import CircularProgress from '@mui/material/CircularProgress'; // Import CircularProgress for loading
import MenuItem from '@mui/material/MenuItem';
import AppTheme from '../shared-theme/AppTheme.jsx';
import { useNavigate, Link as RouterLink } from 'react-router-dom'; // Import useNavigate and Link from react-router-dom
import { useLocation } from 'react-router-dom'; // Import useLocation
import ColorModeSelect from '../shared-theme/ColorModeSelect.jsx';
import { AsyncIcon } from './components/CustomIcons.jsx';
import AsyncAccessIcon from '../home-page/components/AsyncAccessIcon.jsx';
import { Link as route } from 'react-router-dom';
import { signup } from '../services/authService.js'; // Import the signup function

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  [theme.breakpoints.up('sm')]: {
    width: '450px',
  },
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const SignUpContainer = styled(Stack)(({ theme }) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  minHeight: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage:
      'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {
      backgroundImage:
        'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
}));

export default function SignUp(props) {
  // Initialize the navigation hook
  const navigate = useNavigate();
  const location = useLocation(); // Get location object

  // State for form inputs
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [role, setRole] = React.useState('');

  // State for validation errors
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const [nameError, setNameError] = React.useState(false);
  const [nameErrorMessage, setNameErrorMessage] = React.useState('');
  const [registrationError, setRegistrationError] = React.useState(''); // State for API errors
  const [loading, setLoading] = React.useState(false); // State for loading indicator

  React.useEffect(() => {
    // Check if email was passed in location state and set it
    if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location.state]); // Re-run if location.state changes

  const validateInputs = () => {
    let isValid = true;

    // Reset previous errors
    setNameError(false);
    setNameErrorMessage('');
    setEmailError(false);
    setEmailErrorMessage('');
    setPasswordError(false);
    setPasswordErrorMessage('');

    // Validate Name
    if (!name.trim()) {
      setNameError(true);
      setNameErrorMessage('Name is required.');
      isValid = false;
    }

    // Validate Email
    if (!email.trim()) {
      setEmailError(true);
      setEmailErrorMessage('Email is required.');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError(true);
      setEmailErrorMessage('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailErrorMessage('');
    }

    // Validate Password
    if (!password) {
      setPasswordError(true);
      setPasswordErrorMessage('Password is required.');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must be at least 6 characters long.');
      isValid = false;
    } else {
      setPasswordErrorMessage('');
    }

    // Validate Role
    if (!role) {
      // Assuming you want to handle role validation as well
      // You might not need an error state for the dropdown, but handle it as needed
      setRegistrationError('Please select a role.');
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setRegistrationError(''); // Clear previous errors

    if (!validateInputs()) {
      return; // Stop if validation fails
    }

    setLoading(true);
    try {
      // Call the signup service
      const userData = await signup(name, email, password, role);
      // Minimal log, navigation implies success for verification step
      // console.log('Roled registration successful, verification needed:', userData); // Removed verbose log
      navigate('/verify-email', { state: { email: email } });
    } catch (error) {
      console.error('Roled registration failed:', error);
      setRegistrationError(error.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
      <SignUpContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <AsyncAccessIcon />
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)', textAlign: 'center' }}
          >
            Sign Up
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <FormControl>
              <FormLabel htmlFor="name">Full name</FormLabel>
              <TextField
                autoComplete="name"
                name="name"
                required
                fullWidth
                id="name"
                placeholder="Yo Gurt"
                error={nameError}
                helperText={nameErrorMessage}
                value={name} // Controlled component
                onChange={(e) => setName(e.target.value)} // Update state
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                required
                fullWidth
                id="email"
                placeholder="yogurt@email.com"
                name="email"
                autoComplete="email"
                variant="outlined"
                error={emailError}
                helperText={emailErrorMessage}
                value={email} // Controlled component
                onChange={(e) => setEmail(e.target.value)} // Update state
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <TextField
                required
                fullWidth
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                autoComplete="new-password"
                variant="outlined"
                error={passwordError}
                helperText={passwordErrorMessage} // Corrected helper text source
                value={password} // Controlled component
                onChange={(e) => setPassword(e.target.value)} // Update state
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="role">Role</FormLabel>
              <Select
                required
                fullWidth
                id="role"
                name="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                variant="outlined"
                displayEmpty
              >
                <MenuItem value="" disabled>
                  Select Role
                </MenuItem>
                <MenuItem value="Organizer">Organizer</MenuItem>
                <MenuItem value="Admin">Admin</MenuItem>
              </Select>
            </FormControl>


            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading} // Disable button while loading
            >
              Sign up
            </Button>
          </Box>
          <Divider>
            <Typography sx={{ color: 'text.secondary' }}>or</Typography>
          </Divider>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<AsyncIcon />}
              component={route} to="/signup"
            >
              Register as a User
            </Button>
            {registrationError && <Alert severity="error" sx={{ mt: 2 }}>{registrationError}</Alert>} {/* Display API error */}
            <Typography sx={{ textAlign: 'center' }}>
              Already have an account?{' '}
              <Link
                component={RouterLink} // Use RouterLink for client-side navigation
                to="/login-roled"
                variant="body2"
                sx={{ alignSelf: 'center' }}
              >
                Sign in
              </Link>
            </Typography>
            {loading && <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}><CircularProgress /></Box>} {/* Loading indicator */}
          </Box>
        </Card>
      </SignUpContainer>
    </AppTheme>
  );
}
