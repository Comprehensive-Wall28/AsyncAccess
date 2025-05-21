import * as React from 'react';
import {Box, CircularProgress, Alert } from '@mui/material';
import Button from '@mui/material/Button';
import MuiCard from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import ForgotPassword from './ForgotPassword';
import AsyncAccessIcon from '../../home-page/components/AsyncAccessIcon';
import { AsyncIcon } from '../../sign-up/components/CustomIcons.jsx';
import authService from '../../services/authService'; 
import { useNavigate, useLocation } from 'react-router-dom'; // Import useNavigate and useLocation
import { Link as route } from 'react-router-dom';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
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

export default function SignInCard() {
  const location = useLocation();
  const [email, setEmail] = React.useState('');
  const [code, setCode] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [codeError, setCodeError] = React.useState('');
  const [passwordError, setPasswordError] = React.useState('');
  const [resetError, setResetError] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    // Set email from location state if available
    if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location.state]);

  const validateInputs = () => {
    let isValid = true;
    // Code validation (example: 6 digits)
    if (!code.trim() || !/^\d{6}$/.test(code)) {
      setCodeError('Please enter the 6-digit reset code.');
      isValid = false;
    } else {
      setCodeError('');
    }
    // New password validation (min 6 characters)
    if (!newPassword || newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      isValid = false;
    } else {
      setPasswordError('');
    }
    return isValid;
  };

  const handleResetPassword = async (event) => {
    event.preventDefault();
    setResetError('');
    if (!validateInputs()) return;

    setLoading(true);
    try {
      const response = await authService.resetPassword(email, code, newPassword);
      console.log('Password reset successful:', response);

      // Redirect to sign-in with a success message
      navigate('/login', { state: { message: 'Password reset successful. Please log in with your new password.' } });
    } catch (error) {
      console.error('Password reset failed:', error);
      setResetError(error.message || 'Password reset failed. Please check your code and try again.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <Card variant="outlined">
      <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
        <AsyncAccessIcon />
      </Box>
          <AsyncAccessIcon />
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)', textAlign: 'center' }}
          >
            Reset Password
          </Typography>
      <Box
        component="form"
        onSubmit={handleResetPassword}
        noValidate
        sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2 }}
      >
        <FormControl>
          <FormLabel htmlFor="reset-email">Email</FormLabel>
          <TextField
            id="reset-email"
            type="email"
            name="email"
            placeholder="your@email.com"
            autoComplete="email"
            autoFocus
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            variant="outlined"
            disabled={true} // Disable email field
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="code">Reset Code</FormLabel>
          <TextField
            error={!!codeError}
            helperText={codeError}
            id="code"
            name="code"
            placeholder="6-digit code"
            type="text"
            required
            value={code}
            onChange={(e) => setCode(e.target.value)}
            fullWidth
            variant="outlined"
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="new-password">New Password</FormLabel>
          <TextField
            error={!!passwordError}
            helperText={passwordError}
            name="newPassword"
            placeholder="••••••"
            type="password"
            id="new-password"
            autoComplete="new-password"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            fullWidth
            variant="outlined"
          />
        </FormControl>
        {resetError && (
          <Alert severity="error" sx={{ mt: 1 }}>
            {resetError}
          </Alert>
        )}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Reset Password'}
        </Button>


        <Divider>
          <Typography sx={{ color: 'text.secondary' }}>Return</Typography>
        </Divider>

        <Typography sx={{ textAlign: 'center' }}>
          <span>
            <Link
              component={route}
              to="/login"
              variant="body2"
              sx={{ alignSelf: 'center' }}
            >
              Back to Sign In
            </Link>
          </span>
        </Typography>
      </Box>
    </Card>
  );
}
