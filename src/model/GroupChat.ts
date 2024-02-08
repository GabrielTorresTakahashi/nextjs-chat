import mongoose from "@/database";
import mongooseAutoPopulate from "mongoose-autopopulate";

const groupChatSchema = new mongoose.Schema({
    name: {
        type: String,
        default: "",
    },
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
        autopopulate: true,
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
});

groupChatSchema.plugin(mongooseAutoPopulate);

export default mongoose.models.GroupChat || mongoose.model('GroupChat', groupChatSchema);
