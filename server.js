require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const { errorHandler } = require('./utils/errorHandler');
const socketManager = require('./utils/socketManager');

// Import routes
const authRoutes = require('./routes/auth');
const quizRoutes = require('./routes/quiz');

// Initialize express app
const app = express();
const server = http.createServer(app);

// Initialize Socket.io
const io = socketManager(server);

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json()); // Body parser
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // Cookie parser

app.use(helmet()); // Security headers
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true // Allow cookies
}));

// Request logging middleware (development only)
if (process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
        console.log(`${req.method} ${req.path}`);
        next();
    });
}

// Routes
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Quiz Platform API',
        version: '1.0.0'
    });
});

app.use('/api/auth', authRoutes);
app.use('/api/quizzes', quizRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found'
    });
});

// Error handler (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
const LServer = server.listen(PORT, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('👋 SIGTERM received. Shutting down gracefully...');
    LServer.close(() => {
        console.log('💤 Process terminated');
    });
});

process.on('unhandledRejection', (err) => {
    console.error('❌ Unhandled Promise Rejection:', err);
    LServer.close(() => process.exit(1));
});

module.exports = app;
