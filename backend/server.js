const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();

// Connect to MongoDB
const startServer = async () => {
    try {
        await connectDB();
        
        // Middleware
        app.use(cors({
            origin: ["http://deploy-mern-1whq.vercel.app"],
            method: ["POST", "GET"]
            credentials: true
        }));
        app.use(express.json());

        // Routes
        const authRoutes = require('./routes/authRoutes');
        const userRoutes = require('./routes/userRoutes');
        const adminRoutes = require('./routes/adminRoutes');

        app.use('/api/auth', authRoutes);
        app.use('/api/users', userRoutes);
        app.use('/api/admin', adminRoutes);

        app.get('/', (req, res) => {
            res.send('API is running');
        });

        // Define port
        const PORT = process.env.PORT || 8000;

        // Start server
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error.message);
        process.exit(1);
    }
};

startServer();
