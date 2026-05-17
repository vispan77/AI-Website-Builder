import User from "../models/user.js";
import jwt from "jsonwebtoken"

export const googleAuth = async (req, res) => {
    try {
        const { name, email, avatar } = req.body;
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            })
        }
        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                name,
                email,
                avatar
            })
        }

        //generate token
        //in token add 3 things first is the user id, second is the jwt secret and the last is expires time
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        //store the token in the cookie
        //cookie have 3 things first is name and second is value and the last is options
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            success: true,
            message: "User logged in successfully",
            data: user
        })


    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while logging in",

        })
    }
}

export const logout = async(req, res) => {
    try {
        return res.clearCookie("token",{
            httpOnly: true,
            secure: true,
            sameSite: "none",
        }).status(200).json({
            success: true,
            message: "User logged out successfully"
        });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while logging out"
        })
    }
}