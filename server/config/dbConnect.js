import mongoose from "mongoose";

const dbConnect = async() => {
    try {
        const url = process.env.MONGODB_URL;

        await mongoose.connect(url);
        console.log("DB is connected successfully");
    } catch (error) {
        console.log("Something went wrong while connecting DB");
        process.exit(1);
    }
}

export default dbConnect;