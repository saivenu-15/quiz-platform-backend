const jwt = require('jsonwebtoken');

const generateToken = (res, userId) => {
    // Generate JWT token
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '7d',
    });

    // Set JWT as HTTP-Only cookie
    res.cookie('token', token, {
        httpOnly: true, // Prevents XSS attacks
        secure: process.env.NODE_ENV === 'production', // HTTPS only in production
        sameSite: 'lax', // Relaxed for local dev across ports
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    });

    return token;
};

module.exports = generateToken;
