import jwt from "jsonwebtoken";

const userVerifyMiddle = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        // Check if authorization header is present
        if (!authHeader) {
            return res.json({
                message: "Authorization header missing",
                status: false
            });
        }

        // Extract token from the authorization header
        const token = authHeader.split(" ")[1];
        console.log("Token:", token);

        // Verify the token
        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.json({
                    message: err.name === "TokenExpiredError" ? "Token expired" : "Invalid token",
                    status: false
                });
            }

            // Token is valid, attach decoded info to request
            req.user = decoded;
            next(); // Proceed to the next middleware
        });
        
    } catch (error) {
        res.json({
            message: "An error occurred during token verification",
            status: false
        });
    }
};

export default userVerifyMiddle;
