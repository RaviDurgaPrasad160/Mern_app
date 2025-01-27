import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../config/axios';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Schedule as PendingIcon,
  Reddit as RedditIcon,
  Twitter as TwitterIcon
} from '@mui/icons-material';

const TaskList = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('/api/automation/tasks');
      setTasks(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch tasks');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/automation/tasks/${selectedTask._id}`);
      await fetchTasks();
      setDeleteDialogOpen(false);
      setSelectedTask(null);
      setError(null);
    } catch (err) {
      setError('Failed to delete task');
      console.error('Error deleting task:', err);
    } finally {
      setLoading(false);
    }
  };

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
        return null;
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

  if (loading && tasks.length === 0) {
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
          <Typography variant="h4">Automation Tasks</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/tasks/create')}
          >
            Create Task
          </Button>
        </Grid>

        {error && (
          <Grid item xs={12}>
            <Alert severity="error">{error}</Alert>
          </Grid>
        )}

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Platform</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Schedule</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Last Run</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tasks.map((task) => (
                      <TableRow key={task._id}>
                        <TableCell>
                          {getPlatformIcon(task.socialAccount.platform)}
                        </TableCell>
                        <TableCell>{task.taskType}</TableCell>
                        <TableCell>
                          {new Date(task.schedule).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={getStatusIcon(task.status)}
                            label={task.status}
                            color={getStatusColor(task.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {task.lastRun ? new Date(task.lastRun).toLocaleString() : 'Never'}
                        </TableCell>
                        <TableCell>
                          <IconButton
                            color="primary"
                            onClick={() => navigate(`/tasks/edit/${task._id}`)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => {
                              setSelectedTask(task);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Task</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this task?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteTask} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TaskList;
