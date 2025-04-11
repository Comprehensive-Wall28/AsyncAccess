/*
module.exports= function authorizationMiddleware(roles) {

    return (req, res, next) => {
  
      const userRole = req.user.role;
      console.log(roles)

      if (!roles.includes(userRole)){
          console.log(userRole)
        return res.status(403).json("Sorry! You are not authorized to access this functionality");
      }
      next();
    };
}*/


module.exports = (roles) => (req, res, next) => {
    console.log("Authorization Middleware");
    const userRole = req.user?.role; // Ensure `req.user` is set by authentication middleware
    if (!roles.includes(userRole)) {
        return res.status(403).json({ error: "Forbidden" });
    }
    next(); // Pass control to the next middleware or route handler
}