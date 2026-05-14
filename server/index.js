import express from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import dbConnect from "./config/dbConnect.js";
import authRoutes from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";
import userRouter from "./routes/userRoutes.js";



//middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: [
        "http://localhost:5173"
    ],
    credentials: true
}))

//middleware for routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRouter)

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