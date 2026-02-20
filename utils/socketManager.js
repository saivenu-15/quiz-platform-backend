const socketio = require('socket.io');

const socketManager = (server) => {
    const io = socketio(server, {
        cors: {
            origin: process.env.CLIENT_URL || "http://localhost:3000",
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    console.log('🔌 Socket.io initialized');

    io.on('connection', (socket) => {
        console.log(`📡 New client connected: ${socket.id}`);

        // Join a quiz room
        socket.on('joinQuiz', ({ quizId, username }) => {
            socket.join(quizId);
            console.log(`👤 ${username} joined quiz: ${quizId}`);

            // Notify others in the room
            socket.to(quizId).emit('userJoined', { username });
        });

        // Handle answer submission (real-time notification)
        socket.on('submitAnswer', ({ quizId, username, score }) => {
            console.log(`📝 ${username} submitted answer in quiz: ${quizId}`);

            // Update leaderboard for everyone in the room
            io.to(quizId).emit('leaderboardUpdate', { username, score });
        });

        // Handle disconnection
        socket.on('disconnect', () => {
            console.log(`🔌 Client disconnected: ${socket.id}`);
        });
    });

    return io;
};

module.exports = socketManager;
