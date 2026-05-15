import express from "express";
const websiteRouter = express.Router();

//import the controllers
import { changeWebsite, generateDemo, generateWebsite, getAllWebsites, getWebsiteById } from "../controllers/websiteController.js";
import isAuth from "../middleware/isAuth.js";
import { get } from "mongoose";

//mount the routes
websiteRouter.post("/generate", isAuth, generateWebsite);
websiteRouter.get("/get-by-id/:id", isAuth, getWebsiteById);
websiteRouter.put("/update/:websiteId", isAuth, changeWebsite);
websiteRouter.get("/get-all", isAuth, getAllWebsites);


websiteRouter.get("/demo", generateDemo);

//export the routes
export default websiteRouter;