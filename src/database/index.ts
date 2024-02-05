import mongoose from "mongoose";

mongoose.connect(process.env.CONNECTION_STRING_MONGODB || "")
    .then(() => {
        console.log("MongoDB connected at -> chat")
    })
    .catch(() => {
        console.error("Error connecting to MongoDB")
    })

export default mongoose;