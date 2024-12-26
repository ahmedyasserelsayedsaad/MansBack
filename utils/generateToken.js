const jwt = require('jsonwebtoken');

// Function to generate access token
const generateToken = (payload) => {
    try {
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '26m' });
        return token;
    } catch (error) {
        console.error("Error generating token:", error.message);
        return null; 
    }
};


const generateRefreshToken = (payload) => {
    try {
        return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
    } catch (error) {
        console.error("Error generating refresh token:", error.message);
        return null;
    }
};


module.exports = {
    generateToken,
    generateRefreshToken,
};
