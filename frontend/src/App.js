import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Components
import Navbar from './components/Navbar';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/Dashboard';
import SocialAccounts from './components/automation/SocialAccounts';
import CreateTask from './components/automation/CreateTask';
import TaskList from './components/automation/TaskList';
import TaskSchedule from './components/automation/TaskSchedule';
import AdminDashboard from './components/admin/AdminDashboard';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <div className="App">
            <Navbar />
            <div className="container">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                } />
                <Route path="/accounts" element={
                  <PrivateRoute>
                    <SocialAccounts />
                  </PrivateRoute>
                } />
                <Route path="/tasks/create" element={
                  <PrivateRoute>
                    <CreateTask />
                  </PrivateRoute>
                } />
                <Route path="/tasks" element={
                  <PrivateRoute>
                    <TaskList />
                  </PrivateRoute>
                } />
                <Route path="/schedule" element={
                  <PrivateRoute>
                    <TaskSchedule />
                  </PrivateRoute>
                } />
                <Route path="/admin" element={
                  <PrivateRoute>
                    <AdminDashboard />
                  </PrivateRoute>
                } />
              </Routes>
            </div>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
