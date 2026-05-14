import jwt from "jsonwebtoken";
import User from "../models/user.js";

const isAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if(!token){
            return res.status(401).json({
                success: false,
                message: "Token is missing"
            });
        }

        const decode = jwt.verify(token, process.env.JWT_SECRET);
        
        req.user = await User.findById(decode.id);
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        })
    }
};

export default isAuth;