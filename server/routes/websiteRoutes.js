import express from "express";
const websiteRouter = express.Router();

//import the controllers
import { generateDemo, generateWebsite, getWebsiteById } from "../controllers/websiteController.js";
import isAuth from "../middleware/isAuth.js";
import { get } from "mongoose";

//mount the routes
websiteRouter.post("/generate", isAuth, generateWebsite);
websiteRouter.get("/get-by-id/:id", isAuth, getWebsiteById);
websiteRouter.get("/demo", generateDemo);

//export the routes
export default websiteRouter;