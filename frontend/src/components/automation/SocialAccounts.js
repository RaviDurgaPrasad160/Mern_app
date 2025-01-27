import React, { useState, useEffect } from 'react';
import axios from '../../config/axios';
import {
  Container,
  Typography,
  Grid,
  Card,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Reddit as RedditIcon,
  Twitter as TwitterIcon
} from '@mui/icons-material';

const SocialAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [newAccount, setNewAccount] = useState({
    platform: 'reddit',
    username: '',
    password: ''
  });

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await axios.get('/api/social-accounts');
      setAccounts(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch accounts');
      console.error('Error fetching accounts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAccount = async () => {
    try {
      setLoading(true);
      await axios.post('/api/social-accounts', newAccount);
      await fetchAccounts();
      setOpenDialog(false);
      setNewAccount({ platform: 'reddit', username: '', password: '' });
      setError(null);
    } catch (err) {
      setError('Failed to add account');
      console.error('Error adding account:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async (accountId) => {
    try {
      setLoading(true);
      await axios.delete(`/api/social-accounts/${accountId}`);
      await fetchAccounts();
      setError(null);
    } catch (err) {
      setError('Failed to delete account');
      console.error('Error deleting account:', err);
    } finally {
      setLoading(false);
    }
  };

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'reddit':
        return <RedditIcon color="primary" />;
      case 'twitter':
        return <TwitterIcon color="primary" />;
      default:
        return null;
    }
  };

  if (loading && accounts.length === 0) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4">Social Accounts</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
          >
            Add Account
          </Button>
        </Grid>

        {error && (
          <Grid item xs={12}>
            <Alert severity="error">{error}</Alert>
          </Grid>
        )}

        <Grid item xs={12}>
          <Card>
            <List>
              {accounts.map((account) => (
                <ListItem key={account._id}>
                  <IconButton edge="start">
                    {getPlatformIcon(account.platform)}
                  </IconButton>
                  <ListItemText
                    primary={account.username}
                    secondary={`Platform: ${account.platform}`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDeleteAccount(account._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Card>
        </Grid>
      </Grid>

      {/* Add Account Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add Social Account</DialogTitle>
        <DialogContent>
          <TextField
            select
            fullWidth
            label="Platform"
            value={newAccount.platform}
            onChange={(e) => setNewAccount({ ...newAccount, platform: e.target.value })}
            margin="normal"
            SelectProps={{
              native: true
            }}
          >
            <option value="reddit">Reddit</option>
            <option value="twitter">Twitter</option>
          </TextField>
          <TextField
            fullWidth
            label="Username"
            value={newAccount.username}
            onChange={(e) => setNewAccount({ ...newAccount, username: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={newAccount.password}
            onChange={(e) => setNewAccount({ ...newAccount, password: e.target.value })}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleAddAccount} variant="contained" disabled={loading}>
            Add Account
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SocialAccounts;
