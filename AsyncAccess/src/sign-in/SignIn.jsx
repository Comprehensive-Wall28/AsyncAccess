import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CssBaseline from '@mui/material/CssBaseline';
import FormControlLabel from '@mui/material/FormControlLabel';
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import FormControl from '@mui/material/FormControl';
import ForgotPassword from './components/ForgotPassword';
import AppTheme from '../shared-theme/AppTheme';
import ColorModeSelect from '../shared-theme/ColorModeSelect';
import AsyncAccessIcon  from '../home-page/components/AsyncAccessIcon.jsx';
import { useLocation } from 'react-router-dom'; // Import useLocation
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import authService from '../services/authService'; // Import authService
import { AsyncIcon } from '../sign-up/components/CustomIcons.jsx';
import { Link as route } from 'react-router-dom';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: {
    maxWidth: '450px',
  },
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
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

export default function SignIn(props) {
  const location = useLocation(); // Get location object
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [emailError, setEmailError] = React.useState('');
  const [emailErrorMessage, setEmailErrorMessage] = React.useState(''); // Added for consistency
  const [passwordError, setPasswordError] = React.useState('');
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState(''); // Added for consistency
  const [loginErrorText, setLoginErrorText] = React.useState(''); // For general login errors
  const [loading, setLoading] = React.useState(false);
  const [showForgotPassword, setShowForgotPassword] = React.useState(false);
  const [rememberMe, setRememberMe] = React.useState(false); // State for "Remember me"
  const navigate = useNavigate(); // Hook for navigation

  React.useEffect(() => {
    // Check if email was passed in location state and set it
    if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location.state]); // Re-run if location.state changes

  const handleClickOpen = () => {
    setShowForgotPassword(true);
  };

  const handleClose = () => {
    setShowForgotPassword(false);
  };

  const validateInputs = () => {
    let isValid = true;
    // Email validation
    if (!email.trim()) {
      setEmailError('Email is required.');
      setEmailErrorMessage('Email is required.'); // Keep consistent
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email address.'); // Set error message directly
      setEmailErrorMessage('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError('');
      setEmailErrorMessage('');
    }
    // Password validation
    if (!password) {
      setPasswordError('Password is required.');
      setPasswordErrorMessage('Password is required.'); // Keep consistent
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters long.'); // Set error message directly
      setPasswordErrorMessage('Password must be at least 6 characters long.');
      isValid = false;
    } else {
      setPasswordError('');
      setPasswordErrorMessage('');
    }
    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Clear previous errors
    setLoginErrorText('');

    if (!validateInputs()) {
      return;
    }

    setLoading(true);
    try {
      const userData = await authService.login(email, password);

      if (userData.mfaRequired && userData.email) {
        navigate('/mfa-verify', { state: { email: userData.email }, replace: true });
        return; 
      }
      
      if (rememberMe && userData.currentUser) {
        localStorage.setItem('currentUser', JSON.stringify(userData.currentUser));
      } else {
        localStorage.removeItem('currentUser'); // Clear if not "Remember me" or no currentUser
      }

      // Role-based redirection
      let dashboardPath = '/dashboard'; // Default path
      if (userData.currentUser) {
        switch (userData.currentUser.role) {
          case 'Admin':
            dashboardPath = '/dashboard-admin';
            break;
          case 'Organizer':
            dashboardPath = '/dashboard-organizer';
            break;
          // 'User' role or any other role will use the default '/dashboard'
          default:
            dashboardPath = '/dashboard';
            break;
        }
      }
      navigate(dashboardPath, { replace: true });

    } catch (error) { // 'error' here is likely error.response.data from authService
      if (error.emailNotVerified) { // Check directly on the error object
        // Directly navigate to verify-email page, passing the error message and email
        navigate('/verify-email', { 
          state: { 
            email: error.email || email, // Use email from error object if available
            initialMessage: error.message || 'Your email is not verified. A new verification code has been sent.' 
          }, 
          replace: true 
        });
      } else if (error.mfaRequired) { // Check directly on the error object
        navigate('/mfa-verify', { 
            state: { email: error.email || email }, // Use email from error object if available
            replace: true 
        });
      } else {
        // If error is an object with a message, use it, otherwise use a generic message
        setLoginErrorText(error.message || (typeof error === 'string' ? error : 'Login failed. Please check your credentials or try again later.'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <SignInContainer direction="column" justifyContent="space-between">
        <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
        <Card variant="outlined">
          <AsyncAccessIcon />
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)', textAlign: 'center' }}
          >
            Sign In
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              gap: 2,
            }}
          >
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                error={!!emailError}
                helperText={emailErrorMessage}
                id="email"
                type="email"
                name="email"
                placeholder="your@email.com"
                autoComplete="email"
                autoFocus
                required
                fullWidth
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <TextField
                error={!!passwordError}
                helperText={passwordErrorMessage}
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                autoComplete="current-password"
                required
                fullWidth
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>
            <FormControlLabel
              control={
                <Checkbox 
                  checked={rememberMe} 
                  onChange={(e) => setRememberMe(e.target.checked)} 
                  color="primary" />}
              label="Remember me"
            />
            <ForgotPassword open={showForgotPassword} handleClose={handleClose} />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign in'}
            </Button>
            {loginErrorText && <Alert severity="error" sx={{ mt: 1 }}>{loginErrorText}</Alert>}
            {/* The dedicated button for verify email is removed as navigation is automatic */}
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
              Not registered? Get started now!
            </Button>
            
          
            <Link
              component="button"
              type="button"
              onClick={handleClickOpen}
              variant="body2"
              sx={{ alignSelf: 'center' }}
            >
              Forgot your password?
            </Link>
               <Link
              type="button"
              component={route} to="/login-roled"
              variant="body2"
              sx={{ alignSelf: 'center' }}
            >
              Login as Organizer / Admin
            </Link>
          </Box>
          {/* {loginError && <Alert severity="error" sx={{ mt: 2 }}>{loginError}</Alert>} */} {/* Removed from here, moved up */}
          </Box> {/* This closes the <Box component="form"> */}
        </Card>
      </SignInContainer>
    </AppTheme>
  );
}
