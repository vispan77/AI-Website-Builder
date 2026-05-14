import express from "express";
const authRoutes = express.Router();


//import the controllers
import { googleAuth, logout } from "../controllers/authControllers.js";
import isAuth from "../middleware/isAuth.js";


//mount the routes
authRoutes.post("/google", googleAuth);
authRoutes.get("/logout", logout)



//export the routes
export default authRoutes;