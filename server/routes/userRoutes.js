import express from "express";
const userRouter = express.Router();


//import the controllers
import getCurrentUser from "../controllers/userControllers.js";
import isAuth from "../middleware/isAuth.js";

//mount the router
userRouter.get("/me", isAuth, getCurrentUser);

//export the router
export default userRouter;