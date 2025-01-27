const mongoose = require('mongoose');

const dbName = 'social-bot';

async function connectDB() {
    try {
        const conn = await mongoose.connect(`${process.env.MONGODB_URI}/${dbName}`);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return conn;
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        process.exit(1);
    }
}

module.exports = connectDB;
