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
import authService from '../services/authService'; // Assuming authService.js is updated

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

const MfaVerifyContainer = styled(Stack)(({ theme }) => ({
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

export default function MfaVerify(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = React.useState('');
  const [mfaCode, setMfaCode] = React.useState('');
  const [error, setError] = React.useState('');
  const [successMessage, setSuccessMessage] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    } else {
      setError("Email not provided for MFA. Please try logging in again.");
      // navigate('/login'); // Or handle as appropriate
    }
  }, [location.state, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!mfaCode.trim() || mfaCode.length !== 6 || !/^\d{6}$/.test(mfaCode)) {
      setError('Please enter a valid 6-digit MFA code.');
      return;
    }

    setLoading(true);
    try {
      const userData = await authService.verifyMfa(email, mfaCode);
      setSuccessMessage(userData.message || 'Login successful!');
      
      // Store user data and token (similar to SignIn.jsx)
      // Assuming 'rememberMe' is not a factor here, or handle as needed
      if (userData.currentUser) {
        localStorage.setItem('currentUser', JSON.stringify(userData.currentUser));
      }

      // Role-based redirection
      let dashboardPath = '/dashboard'; 
      if (userData.currentUser) {
        switch (userData.currentUser.role) {
          case 'Admin':
            dashboardPath = '/dashboard-admin';
            break;
          case 'Organizer':
            dashboardPath = '/dashboard-organizer';
            break;
          default:
            dashboardPath = '/dashboard';
            break;
        }
      }
      
      setTimeout(() => {
        navigate(dashboardPath, { replace: true });
      }, 1500);

    } catch (err) {
      setError(err.message || 'Failed to verify MFA code. Please check the code and try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // TODO: Add a "Resend MFA Code" button and functionality if desired.
  // This would require another backend endpoint (e.g., to resend the login MFA code) and service function.

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
      <MfaVerifyContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <AsyncAccessIcon />
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)', textAlign: 'center' }}
          >
            Two-Factor Authentication
          </Typography>
          <Typography sx={{ textAlign: 'center', color: 'text.secondary' }}>
            A verification code has been sent to your email: <strong>{email}</strong>.
            Please enter the code below to complete your login.
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <FormControl>
              <FormLabel htmlFor="mfa-code">Verification Code</FormLabel>
              <TextField
                required
                fullWidth
                id="mfa-code"
                name="mfa-code"
                placeholder="123456"
                value={mfaCode}
                onChange={(e) => setMfaCode(e.target.value)}
                error={!!error}
                inputProps={{ maxLength: 6 }}
              />
            </FormControl>
            {error && <Alert severity="error" sx={{ mt: 1 }}>{error}</Alert>}
            {successMessage && <Alert severity="success" sx={{ mt: 1 }}>{successMessage}</Alert>}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading || !email}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Verify & Sign In'}
            </Button>
          </Box>
        </Card>
      </MfaVerifyContainer>
    </AppTheme>
  );
}
