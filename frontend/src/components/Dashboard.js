import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from '../config/axios';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  CircularProgress
} from '@mui/material';
import {
  AccountCircle as AccountIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Pending as PendingIcon,
  Reddit as RedditIcon,
  Twitter as TwitterIcon
} from '@mui/icons-material';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    failedTasks: 0,
    accounts: {
      reddit: 0,
      twitter: 0
    }
  });
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, tasksRes] = await Promise.all([
          axios.get('/api/automation/stats'),
          axios.get('/api/automation/tasks/recent')
        ]);
        setStats(statsRes.data);
        setRecentTasks(tasksRes.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <SuccessIcon color="success" />;
      case 'failed':
        return <ErrorIcon color="error" />;
      case 'pending':
        return <PendingIcon color="warning" />;
      default:
        return <PendingIcon />;
    }
  };

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'reddit':
        return <RedditIcon color="primary" />;
      case 'twitter':
        return <TwitterIcon color="primary" />;
      default:
        return <AccountIcon />;
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Welcome Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
            <AccountIcon sx={{ fontSize: 40 }} />
            <Box>
              <Typography variant="h4">
                Welcome back, {user?.name}!
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Here's your automation dashboard
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Statistics Cards */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Total Tasks</Typography>
              <Typography variant="h3">{stats.totalTasks}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Completed</Typography>
              <Typography variant="h3" color="success.main">{stats.completedTasks}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Pending</Typography>
              <Typography variant="h3" color="warning.main">{stats.pendingTasks}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Failed</Typography>
              <Typography variant="h3" color="error.main">{stats.failedTasks}</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Connected Accounts */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Connected Accounts
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Chip
                  icon={<RedditIcon />}
                  label={`Reddit (${stats.accounts.reddit})`}
                  color={stats.accounts.reddit > 0 ? "primary" : "default"}
                />
                <Chip
                  icon={<TwitterIcon />}
                  label={`Twitter (${stats.accounts.twitter})`}
                  color={stats.accounts.twitter > 0 ? "primary" : "default"}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Tasks */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Tasks
              </Typography>
              <List>
                {recentTasks.map((task) => (
                  <ListItem key={task._id}>
                    <ListItemIcon>
                      {getPlatformIcon(task.platform)}
                    </ListItemIcon>
                    <ListItemText
                      primary={task.taskType}
                      secondary={new Date(task.schedule).toLocaleString()}
                    />
                    <ListItemIcon>
                      {getStatusIcon(task.status)}
                    </ListItemIcon>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
