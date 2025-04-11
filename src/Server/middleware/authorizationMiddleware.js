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
}