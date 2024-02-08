import mongoose from "@/database";
import mongooseAutoPopulate from "mongoose-autopopulate";

const chatMessageSchema = new mongoose.Schema({
    text: {
        type: String,
        default: "",
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
        autopopulate: true,
    },
    to: {
        type: String,
        default: ""
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
});

chatMessageSchema.plugin(mongooseAutoPopulate);

export default mongoose.models.ChatMessage || mongoose.model('ChatMessage', chatMessageSchema);
