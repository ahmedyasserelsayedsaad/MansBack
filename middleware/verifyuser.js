const jwt = require('jsonwebtoken');

const verfiyToken = (req, res, next) => {
    const authHeader = req.headers['Authorization'] || req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json('token is required')
    }

    const token = authHeader.split(' ')[1];
    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (err) {
        return res.status(400).json({ message: ` invalid token ${err.message}` })
    }
}

module.exports = verfiyToken;