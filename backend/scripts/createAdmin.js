const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        
        const adminUser = await User.create({
            name: 'Admin',
            email: 'admin@gmail.com',
            password: 'admin',
            role: 'admin'
        });

        console.log('Admin user created successfully:', {
            name: adminUser.name,
            email: adminUser.email,
            role: adminUser.role
        });

    } catch (error) {
        console.error('Error creating admin:', error.message);
    } finally {
        await mongoose.disconnect();
    }
};

createAdmin();
