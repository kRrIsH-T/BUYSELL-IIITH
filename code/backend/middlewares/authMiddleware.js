import JWT from 'jsonwebtoken'
import user_model from '../models/user_model.js';

//protected route
export const requireSignin = (req, res, next) => {
    try{
        const decode = JWT.verify(req.headers.authorization, process.env.jwtSecret);
        req.user = decode;
        next()
    }
    catch(error){
        console.log(error);
        res.send({error: "Unauthorized access"});
    }
}

//admin
export const isAdmin = async (req, res, next) => {
    try {
        const user = await user_model.findById(req.user.id); // Use req.user.id instead of req.user.username
        if (user.role !== true) {
            return res.send({ error: "Unauthorized access" });
        } else {
            next();
        }
    } catch (error){
        console.log(error);
        return res.send({ error: "Admin middleware error" });
    }
}
