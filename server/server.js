import express from "express";
const app = express();


import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import dbConnect from "./config/dbConnect.js";
import authRoutes from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";
import userRouter from "./routes/userRoutes.js";
import websiteRouter from "./routes/websiteRoutes.js";
import stripeRouter from "./routes/stripeRoutes.js";
import stripe from "./config/stripe.js";
import { stripeWebhook } from "./controllers/stripeWebhook.js";

//route for the stripe webhoook json as it require raw data
app.post("/api/stripe/webhook", express.raw({ type: "application/json" }), stripeWebhook);

//middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: [
        process.env.FRONTEND_URL,
        "http://localhost:5173"
    ],
    credentials: true
}))

//middleware for routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRouter);
app.use("/api/website", websiteRouter);
app.use("/api/stripe", stripeRouter);


//db connection
await dbConnect()


//server starting
const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`Server is listening at ${port}`)
})

app.get("/", (req, res) => {
    res.send("Welcome to the home page");
})