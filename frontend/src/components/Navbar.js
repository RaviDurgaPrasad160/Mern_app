import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Box,
    Divider
} from '@mui/material';
import {
    Menu as MenuIcon,
    Dashboard as DashboardIcon,
    AccountCircle as AccountIcon,
    Add as AddIcon,
    List as ListIcon,
    Schedule as ScheduleIcon,
    ExitToApp as LogoutIcon
} from '@mui/icons-material';

const Navbar = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [drawerOpen, setDrawerOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const menuItems = [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
        { text: 'Social Accounts', icon: <AccountIcon />, path: '/accounts' },
        { text: 'Create Task', icon: <AddIcon />, path: '/tasks/create' },
        { text: 'Task List', icon: <ListIcon />, path: '/tasks' },
        { text: 'Schedule', icon: <ScheduleIcon />, path: '/schedule' }
    ];

    const drawer = (
        <Box sx={{ width: 250 }} role="presentation">
            {isAuthenticated && user && (
                <Box sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h6">
                        {user.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {user.email}
                    </Typography>
                </Box>
            )}
            <Divider />
            <List>
                {isAuthenticated ? (
                    <>
                        {menuItems.map((item) => (
                            <ListItem
                                button
                                key={item.text}
                                component={Link}
                                to={item.path}
                                selected={location.pathname === item.path}
                                onClick={() => setDrawerOpen(false)}
                            >
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.text} />
                            </ListItem>
                        ))}
                        <Divider />
                        <ListItem button onClick={handleLogout}>
                            <ListItemIcon><LogoutIcon /></ListItemIcon>
                            <ListItemText primary="Logout" />
                        </ListItem>
                    </>
                ) : (
                    <>
                        <ListItem button component={Link} to="/login">
                            <ListItemText primary="Login" />
                        </ListItem>
                        <ListItem button component={Link} to="/register">
                            <ListItemText primary="Register" />
                        </ListItem>
                    </>
                )}
            </List>
        </Box>
    );

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    {isAuthenticated && (
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            onClick={() => setDrawerOpen(true)}
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>
                    )}
                    <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
                        Social Bot Automation
                    </Typography>
                    {!isAuthenticated && (
                        <Box>
                            <Button color="inherit" component={Link} to="/login">
                                Login
                            </Button>
                            <Button color="inherit" component={Link} to="/register">
                                Register
                            </Button>
                        </Box>
                    )}
                </Toolbar>
            </AppBar>
            <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
            >
                {drawer}
            </Drawer>
        </>
    );
};

export default Navbar;
