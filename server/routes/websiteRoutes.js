import express from "express";
const websiteRouter = express.Router();

//import the controllers
import { generateDemo, generateWebsite } from "../controllers/websiteController.js";
import isAuth from "../middleware/isAuth.js";

//mount the routes
websiteRouter.post("/generate", isAuth, generateWebsite);
websiteRouter.get("/demo", generateDemo);

//export the routes
export default websiteRouter;