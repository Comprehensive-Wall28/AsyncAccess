const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET_KEY

module.exports = function authenticationMiddleware(req, res, next) {

  const cookie = req.cookies;

  if (!cookie) {
    return res.status(401).json({ message: "Authentication required" }); // More generic message
  }
  const token = cookie.token;
  if (!token) {
    return res.status(401).json({ message: "Authentication required" }); // More generic message
   }

  jwt.verify(token, secretKey, (error, decoded) => {
    if (error) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.user = decoded.user;
    next();
  });
}