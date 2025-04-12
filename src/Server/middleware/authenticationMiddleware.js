const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET_KEY

module.exports = function authenticationMiddleware(req, res, next) {
  const cookie = req.cookies;

  if (!cookie) {
    return res.status(401).json({ message: "Logged in users only! Please, Log in first" });
  }
  const token = cookie.token;
  if (!token) {
    return res.status(405).json({ message: "No token provided! Please, login first" });
  }

  jwt.verify(token, secretKey, (error, decoded) => {
    if (error) {
      return res.status(403).json({ message: "Invalid token" });
    }

    req.user = decoded.user;
    next();
  });
};