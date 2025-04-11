const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET_KEY;

module.exports = function authenticationMiddleware(req, res, next) {
  console.log("Inside auth middleware");

  // Ensure cookies are parsed
  const cookie = req.cookies;
  if (!cookie || !cookie.token) {
    console.log("No token found in cookies");
    return res.status(401).json({ message: "No token provided" });
  }

  const token = cookie.token; // Extract token from cookies
  console.log("Extracted Token:", token);

  if (!token) {
    console.log("Token is undefined");
    return res.status(401).json({ message: "Token is missing" });
  }

  jwt.verify(token, secretKey, (error, decoded) => {
    if (error) {
      console.log("Token verification failed:", error.message);
      return res.status(403).json({ message: "Invalid token" });
    }

    // Attach the decoded user to the request object
    req.user = decoded.user;
    console.log("Token verified successfully:", decoded);
    next();
  });
};