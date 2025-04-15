module.exports= function authorizationMiddleware(roles) {

    return (req, res, next) => {

        const userRole = req.user.role;

        if (!roles.includes(userRole)){
            return res.status(403).json(`Sorry! You are not authorized to access this functionality. Authorized roles: ${roles}`);
        }
        next();
    };
}