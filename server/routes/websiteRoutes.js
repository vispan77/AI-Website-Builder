import express from "express";
const websiteRouter = express.Router();

//import the controllers
import { changeWebsite, deployWebsite, generateDemo, generateWebsite, getAllWebsites, getWebsiteById, getWebsiteBySlug } from "../controllers/websiteController.js";
import isAuth from "../middleware/isAuth.js";


//mount the routes
websiteRouter.post("/generate", isAuth, generateWebsite);
websiteRouter.get("/get-by-id/:id", isAuth, getWebsiteById);
websiteRouter.put("/update/:websiteId", isAuth, changeWebsite);
websiteRouter.get("/get-all", isAuth, getAllWebsites);
websiteRouter.get("/deploy/:id", isAuth, deployWebsite);
websiteRouter.get("/get-by-slug/:slug", isAuth, getWebsiteBySlug);


websiteRouter.get("/demo", generateDemo);

//export the routes
export default websiteRouter;