const JWT = require("jsonwebtoken");
const UserModel = require("../models/UserModel");

// Protected route Token base 
const requireSignIn = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        // Check if the Authorization header is provided and follows the 'Bearer <token>' format
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: "Authorization token missing or malformed",
            });
        }

        // Extract the token by removing 'Bearer ' prefix
        const token = authHeader.split(' ')[1];

        // Verify the token
        const decoded = JWT.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decoded; // Attach decoded user information (e.g., user ID) to the request

        next(); // Continue to the next middleware or controller
    } catch (error) {
        console.log("Token verification error: ", error);
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: "Token has expired.",
            });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: "Invalid token.",
            });
        } else {
            return res.status(500).json({
                success: false,
                message: "Internal server error.",
            });
        }
    }
};



module.exports = { requireSignIn };
