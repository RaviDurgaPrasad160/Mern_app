import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../config/axios';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  MenuItem,
  Box,
  Alert,
  CircularProgress
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const CreateTask = () => {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [task, setTask] = useState({
    socialAccount: '',
    taskType: 'post',
    schedule: new Date(),
    content: {
      text: '',
      subreddit: '',
      hashtags: '',
      media: []
    }
  });

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await axios.get('/api/social-accounts');
      setAccounts(response.data);
    } catch (err) {
      setError('Failed to fetch accounts');
      console.error('Error fetching accounts:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formattedTask = {
        ...task,
        content: {
          ...task.content,
          hashtags: task.content.hashtags.split(',').map(tag => tag.trim()),
        }
      };

      await axios.post('/api/automation/tasks', formattedTask);
      navigate('/tasks');
    } catch (err) {
      setError('Failed to create task');
      console.error('Error creating task:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleContentChange = (field, value) => {
    setTask(prev => ({
      ...prev,
      content: {
        ...prev.content,
        [field]: value
      }
    }));
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h4" gutterBottom>
              Create Automation Task
            </Typography>
          </Grid>

          {error && (
            <Grid item xs={12}>
              <Alert severity="error">{error}</Alert>
            </Grid>
          )}

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      select
                      fullWidth
                      label="Social Account"
                      value={task.socialAccount}
                      onChange={(e) => setTask({ ...task, socialAccount: e.target.value })}
                      required
                    >
                      {accounts.map((account) => (
                        <MenuItem key={account._id} value={account._id}>
                          {account.username} ({account.platform})
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      select
                      fullWidth
                      label="Task Type"
                      value={task.taskType}
                      onChange={(e) => setTask({ ...task, taskType: e.target.value })}
                      required
                    >
                      <MenuItem value="post">Create Post</MenuItem>
                      <MenuItem value="comment">Add Comment</MenuItem>
                      <MenuItem value="like">Like Post</MenuItem>
                      <MenuItem value="share">Share Post</MenuItem>
                      <MenuItem value="dm">Send Direct Message</MenuItem>
                    </TextField>
                  </Grid>

                  <Grid item xs={12}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DateTimePicker
                        label="Schedule"
                        value={task.schedule}
                        onChange={(newValue) => setTask({ ...task, schedule: newValue })}
                        renderInput={(params) => <TextField {...params} fullWidth required />}
                        minDateTime={new Date()}
                      />
                    </LocalizationProvider>
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label="Content Text"
                      value={task.content.text}
                      onChange={(e) => handleContentChange('text', e.target.value)}
                      required
                    />
                  </Grid>

                  {task.taskType === 'post' && (
                    <>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Subreddit"
                          value={task.content.subreddit}
                          onChange={(e) => handleContentChange('subreddit', e.target.value)}
                          helperText="Required for Reddit posts"
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Hashtags"
                          value={task.content.hashtags}
                          onChange={(e) => handleContentChange('hashtags', e.target.value)}
                          helperText="Comma-separated hashtags (for Twitter)"
                        />
                      </Grid>
                    </>
                  )}
                </Grid>

                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    type="button"
                    onClick={() => navigate('/tasks')}
                    sx={{ mr: 2 }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                  >
                    Create Task
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default CreateTask;
