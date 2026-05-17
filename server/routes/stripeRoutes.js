import express from "express";
const stripeRouter = express.Router();



//import the controller
import isAuth from "../middleware/isAuth.js";
import { stripeCheckout } from "../controllers/stripeController.js";

//mount the routes
stripeRouter.post("/", isAuth, stripeCheckout);

//export the route
export default stripeRouter;