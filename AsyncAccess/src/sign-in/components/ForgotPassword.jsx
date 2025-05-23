import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField'; 
import { Alert, CircularProgress, Box } from '@mui/material'; 
import authService from '../../services/authService'; 
import { useNavigate } from 'react-router-dom';

function ForgotPassword({ open, handleClose }) {
  const [email, setEmail] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [error, setError] = React.useState('');

  const navigate = useNavigate();
  React.useEffect(() => {
    if (open) {
      setEmail('');
      setMessage('');
      setError('');
    }
  }, [open]);

  const handleContinue = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      const response = await authService.requestPasswordReset(email);
      setMessage(response.message || 'Password reset instructions sent to your email.');
      navigate('/forgot-password', {
        state: { email: email },
        replace: true, // Use replace to avoid going back to the sign-in page on back navigation
      });
    } catch (err) {
      setError(err.message || 'Failed to send password reset request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      slotProps={{
        paper: {
          component: 'form',
          onSubmit: handleContinue,
        },
      }}
      sx={{ '& .MuiDialog-paper': { backgroundImage: 'none' } }} // Ensure sx is applied to Paper
    >
      <DialogTitle>Reset password</DialogTitle>
      <DialogContent
        sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%', minWidth: { xs: 'auto', sm: '400px' } }}
      >
        <DialogContentText>
          Enter your account&apos;s email address, and we&apos;ll send you a code to
          reset your password.
        </DialogContentText>
        {message && <Alert severity="success" sx={{ mt: 1, mb: 1 }}>{message}</Alert>}
        {error && <Alert severity="error" sx={{ mt: 1, mb: 1 }}>{error}</Alert>}
        <TextField // Changed from OutlinedInput
          autoFocus
          required
          margin="dense" // TextField uses margin prop
          id="forgot-password-email" // Changed ID to avoid conflict if SignIn also has an 'email' id
          name="email"
          //label="Email address"
          placeholder="Email address"
          type="email"
          fullWidth
          value={email}
          variant="outlined" // Added variant for consistency
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
      </DialogContent>
      <DialogActions sx={{ pb: 3, px: 3 }}>
        <Button onClick={handleClose} disabled={loading}>Cancel</Button>
        <Button variant="contained" type="submit" disabled={loading}>
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Continue'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

ForgotPassword.propTypes = {
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

export default ForgotPassword;
