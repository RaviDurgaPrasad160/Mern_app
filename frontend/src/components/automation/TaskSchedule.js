import React, { useState, useEffect } from 'react';
import axios from '../../config/axios';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
  Box,
  Chip,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  Stack,
  Divider
} from '@mui/material';
import {
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Schedule as PendingIcon,
  Reddit as RedditIcon,
  Twitter as TwitterIcon,
  Info as InfoIcon
} from '@mui/icons-material';

const TaskSchedule = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchScheduledTasks();
  }, []);

  const fetchScheduledTasks = async () => {
    try {
      const response = await axios.get('/api/automation/tasks/scheduled');
      const sortedTasks = response.data.sort((a, b) => new Date(a.schedule) - new Date(b.schedule));
      setTasks(sortedTasks);
      setError(null);
    } catch (err) {
      setError('Failed to fetch scheduled tasks');
      console.error('Error fetching scheduled tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'failed':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <SuccessIcon />;
      case 'failed':
        return <ErrorIcon />;
      case 'pending':
        return <PendingIcon />;
      default:
        return <PendingIcon />;
    }
  };

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'reddit':
        return <RedditIcon />;
      case 'twitter':
        return <TwitterIcon />;
      default:
        return null;
    }
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
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>
            Task Schedule
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
              {tasks.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 3 }}>
                  <Typography variant="h6" color="text.secondary">
                    No scheduled tasks found
                  </Typography>
                </Box>
              ) : (
                <Stack spacing={2} divider={<Divider flexItem />}>
                  {tasks.map((task) => (
                    <Box key={task._id} sx={{ p: 2 }}>
                      <Paper elevation={3} sx={{ p: 2 }}>
                        <Grid container spacing={2} alignItems="center">
                          <Grid item xs={12} sm={3}>
                            <Typography color="text.secondary">
                              {new Date(task.schedule).toLocaleString()}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={9}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              {getPlatformIcon(task.socialAccount.platform)}
                              <Typography variant="h6">
                                {task.taskType}
                              </Typography>
                              <Chip
                                icon={getStatusIcon(task.status)}
                                label={task.status}
                                color={getStatusColor(task.status)}
                                size="small"
                                sx={{ ml: 'auto' }}
                              />
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                              Account: {task.socialAccount.username}
                            </Typography>
                            <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Tooltip title="View task details">
                                <IconButton size="small">
                                  <InfoIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </Grid>
                        </Grid>
                      </Paper>
                    </Box>
                  ))}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default TaskSchedule;
