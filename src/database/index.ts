import mongoose from "mongoose";

mongoose.connect(process.env.DB_STRING || "")
    .then(() => {
        console.log("MongoDB connected")
    })
    .catch(() => {
        console.error("Error connecting to MongoDB")
    })

export default mongoose;