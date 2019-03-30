const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const jwtAuth = () => {
    return (req, res, next) => {
        let token = req.query.token || req.get('Authorization'); 
        
        if (!token) {
            res.status(401).json({
                success: false,
                error: "No token provided"
            });
            return;
        }

        console.log(token)

        token = token.replace("Bearer ", "");

        // verify token
        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, payload) => {
            if(err){
                res.status(401).json({
                    success: false,
                    error: err.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token'
                });
                return;
            }

            req.userId = payload._id;
            next();
        });
    }
}

module.exports = jwtAuth;