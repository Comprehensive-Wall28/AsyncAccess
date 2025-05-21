module.exports= function authorizationMiddleware(roles) {

    return (req, res, next) => {

        const userRole = req.user.role;

        if (!roles.includes(userRole)){
            return res.status(403).json({message: "Authorization required"}); // More generic message
        }
        next();
    };
}