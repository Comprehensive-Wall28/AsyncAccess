import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import AppTheme from '../shared-theme/AppTheme';
import ColorModeSelect from '../shared-theme/ColorModeSelect';
import AsyncAccessIcon from '../home-page/components/AsyncAccessIcon.jsx';
import { useLocation, useNavigate } from 'react-router-dom';
// You'll need to create this service function
import { verifyEmail as verifyEmailService } from '../services/authService'; // Assuming authService.js is updated

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

const VerifyEmailContainer = styled(Stack)(({ theme }) => ({
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

export default function VerifyEmail(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = React.useState('');
  const [code, setCode] = React.useState('');
  const [error, setError] = React.useState('');
  const [successMessage, setSuccessMessage] = React.useState('');
  const [initialMessage, setInitialMessage] = React.useState(location.state?.initialMessage || ''); // New state for message from SignIn
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    } else {
      // If no email is passed, redirect to signup or show an error
      // For now, let's assume email is always passed or handle this case as needed
      setError("Email not provided. Please go back to sign up.");
      // navigate('/signup'); 
    }
  }, [location.state, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccessMessage('');
    setInitialMessage(''); // Clear initial message on new submission attempt

    if (!code.trim() || code.length !== 6 || !/^\d{6}$/.test(code)) {
      setError('Please enter a valid 6-digit verification code.');
      return;
    }

    setLoading(true);
    try {
      const responseData = await verifyEmailService(email, code); // responseData now contains { message, currentUser }
      setSuccessMessage(responseData.message || 'Email verified successfully! You are now logged in. Redirecting...');
      
      if (responseData.currentUser) {
        // Store currentUser in localStorage (similar to SignIn.jsx)
        // For simplicity, we'll always store it here. 
        // A "Remember Me" option could be added to the signup form if needed.
        localStorage.setItem('currentUser', JSON.stringify(responseData.currentUser));

        // Role-based redirection
        let dashboardPath = '/dashboard'; // Default path
        switch (responseData.currentUser.role) {
          case 'Admin':
            dashboardPath = '/dashboard-admin';
            break;
          case 'Organizer':
            dashboardPath = '/dashboard-organizer';
            break;
          default: // User or other roles
            dashboardPath = '/dashboard';
            break;
        }
        setTimeout(() => {
          navigate(dashboardPath, { replace: true });
        }, 2000); // Keep a short delay for the user to read the success message
      } else {
        // Fallback if currentUser is not in response, though backend should always send it on success now
        setError('Verification successful, but auto-login failed. Please try logging in manually.');
        setTimeout(() => {
          navigate('/login', { state: { email: email, verified: true } });
        }, 2000);
      }
    } catch (err) {
      setError(err.message || 'Failed to verify email. Please check the code and try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // TODO: Add a "Resend Code" button and functionality if desired.
  // This would require another backend endpoint and service function.

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
      <VerifyEmailContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <AsyncAccessIcon />
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)', textAlign: 'center' }}
          >
            Verify Your Email
          </Typography>
          <Typography sx={{ textAlign: 'center', color: 'text.secondary' }}>
            A verification code has been sent to <strong>{email}</strong>.
            Please enter the code below.
          </Typography>
          {initialMessage && <Alert severity="info" sx={{ mb: 2 }}>{initialMessage}</Alert>} {/* Display message from SignIn */}
          {error && <Alert severity="error" sx={{ mt: 1 }}>{error}</Alert>}
          {successMessage && <Alert severity="success" sx={{ mt: 1 }}>{successMessage}</Alert>}
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <FormControl>
              <FormLabel htmlFor="verification-code">Verification Code</FormLabel>
              <TextField
                required
                fullWidth
                id="verification-code"
                name="verification-code"
                placeholder="123456"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                error={!!error} // Show error state on TextField if error exists
                inputProps={{ maxLength: 6 }}
              />
            </FormControl>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading || !email}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Verify Email'}
            </Button>
          </Box>
        </Card>
      </VerifyEmailContainer>
    </AppTheme>
  );
}
