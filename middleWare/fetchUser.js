import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const fetchUser = (req, res, next) => {
    // Extract JWT token from the request headers
    const token = req.headers['auth-token'];

    // Check if the token exists
    if (!token) {
        return res.status(401).json({ error: "Please provide a valid authentication token" });
    }

    try {
        // Verify the JWT token
        const { userId } = jwt.verify(token, "" + process.env.JWT_SECRET);
        
        // Attach the userId to the request object for further middleware/routes
        req.userId = userId;

        // Log user ID for debugging or auditing purposes
        console.log("User ID:", userId);

        // Call the next middleware function in the chain
        next();
    } catch (error) {
        // Token verification failed
        return res.status(401).json({ error: "Invalid or expired token. Please authenticate again." });
    }
};

export default fetchUser;
