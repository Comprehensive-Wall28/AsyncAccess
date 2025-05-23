import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Select from '@mui/material/Select'; // Added for dropdown
import InputLabel from '@mui/material/InputLabel'; // Added for dropdown label
import { deleteUserById, updateUserRoleById } from '../../services/userService'; // Added updateUserRoleById

function UsersList({ users, onUserDeleted, onRoleChanged, currentUserId }) { // Added currentUserId prop
  const [search, setSearch] = React.useState('');
  const [page, setPage] = React.useState(0);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedUser, setSelectedUser] = React.useState(null); // Store the whole user object

  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [deleteLoading, setDeleteLoading] = React.useState(false);
  const [deleteError, setDeleteError] = React.useState('');

  const [openRoleDialog, setOpenRoleDialog] = React.useState(false);
  const [selectedNewRole, setSelectedNewRole] = React.useState('');
  const [roleChangeLoading, setRoleChangeLoading] = React.useState(false);
  const [roleChangeError, setRoleChangeError] = React.useState('');


  const usersPerPage = 10;

  const filteredUsers = users.filter(
    user =>
      (user.id || user._id) !== currentUserId && // Exclude current user
      (user.name?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase()))
  );

  const paginatedUsers = filteredUsers.slice(page * usersPerPage, page * usersPerPage + usersPerPage);

  const handleMenuOpen = (event, user) => { // Pass the whole user object
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    // Don't clear selectedUser here, dialogs might need it
  };

  const handleOpenDeleteDialog = () => {
    if (selectedUser) {
      setOpenDeleteDialog(true);
    }
    handleMenuClose();
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setDeleteError('');
    setSelectedUser(null);
  };

  const handleConfirmDelete = async () => {
    if (!selectedUser) return;

    setDeleteLoading(true);
    setDeleteError('');
    try {
      await deleteUserById(selectedUser.id || selectedUser._id);
      if (onUserDeleted) {
        onUserDeleted(selectedUser.id || selectedUser._id);
      }
      handleCloseDeleteDialog();
    } catch (err) {
      setDeleteError(err.message || 'Failed to delete user. Please try again.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleOpenRoleDialog = () => {
    if (selectedUser) {
      setSelectedNewRole(selectedUser.role); // Pre-fill with current role
      setOpenRoleDialog(true);
    }
    handleMenuClose();
  };

  const handleCloseRoleDialog = () => {
    setOpenRoleDialog(false);
    setRoleChangeError('');
    setSelectedNewRole('');
    setSelectedUser(null);
  };

  const handleConfirmRoleChange = async () => {
    if (!selectedUser || !selectedNewRole) return;

    setRoleChangeLoading(true);
    setRoleChangeError('');
    try {
      await updateUserRoleById(selectedUser.id || selectedUser._id, selectedNewRole);
      if (onRoleChanged) {
        onRoleChanged(selectedUser.id || selectedUser._id, selectedNewRole); // Notify parent
      }
      handleCloseRoleDialog();
    } catch (err) {
      setRoleChangeError(err.response?.data?.message || err.message || 'Failed to change role.');
    } finally {
      setRoleChangeLoading(false);
    }
  };


  return (
    <React.Fragment>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <FormControl variant="outlined" size="small">
          <FormLabel htmlFor="search-users" sx={{ mb: 0.5, fontSize: '0.875rem' }}>Search users</FormLabel>
          <TextField
            id="search-users"
            variant="outlined"
            size="small"
            placeholder="Filter by name or email..." // Placeholder can be more descriptive
            value={search}
            onChange={e => {
              setSearch(e.target.value);
              setPage(0);
            }}
            sx={{ minWidth: '25ch' }} // Ensure it has some width
          />
        </FormControl>
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="users table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedUsers.map((user) => (
              <TableRow
                key={user.id || user._id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {user.name}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell align="right">
                  <IconButton
                    aria-label="more"
                    onClick={e => handleMenuOpen(e, user)} // Pass user object
                  >
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {paginatedUsers.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => {
            handleMenuClose();
            setSelectedUser(null); 
          }}
        >
          <MenuItem onClick={handleOpenDeleteDialog}>Delete User</MenuItem>
          <MenuItem onClick={handleOpenRoleDialog}>Change Role</MenuItem>
        </Menu>
      </TableContainer>
      <TablePagination
        component="div"
        count={filteredUsers.length}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        rowsPerPage={usersPerPage}
        rowsPerPageOptions={[usersPerPage]}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this user? This action cannot be undone.
          </DialogContentText>
          {deleteError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {deleteError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} disabled={deleteLoading}>
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus disabled={deleteLoading}>
            {deleteLoading ? <CircularProgress size={24} color="inherit" /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Change Role Dialog */}
      <Dialog open={openRoleDialog} onClose={handleCloseRoleDialog}>
        <DialogTitle>Change User Role</DialogTitle>
        <DialogContent sx={{ minWidth: '300px' }}>
          <DialogContentText sx={{ mb: 2 }}>
            Select a new role for {selectedUser?.name || 'this user'}.
          </DialogContentText>
          <FormControl fullWidth>
            <InputLabel id="role-select-label">Role</InputLabel>
            <Select
              labelId="role-select-label"
              id="role-select"
              value={selectedNewRole}
              label="Role"
              onChange={(e) => setSelectedNewRole(e.target.value)}
            >
              <MenuItem value="User">User</MenuItem>
              <MenuItem value="Organizer">Organizer</MenuItem>
              <MenuItem value="Admin">Admin</MenuItem>
            </Select>
          </FormControl>
          {roleChangeError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {roleChangeError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRoleDialog} disabled={roleChangeLoading}>
            Cancel
          </Button>
          <Button onClick={handleConfirmRoleChange} color="primary" disabled={roleChangeLoading || !selectedNewRole || selectedNewRole === selectedUser?.role}>
            {roleChangeLoading ? <CircularProgress size={24} color="inherit" /> : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

export default UsersList;