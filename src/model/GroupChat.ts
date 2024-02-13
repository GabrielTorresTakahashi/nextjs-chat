import mongoose from "@/database";
import mongooseAutoPopulate from "mongoose-autopopulate";
import ChatMessage from "./ChatMessage";
import User from "./User";

const groupChatSchema = new mongoose.Schema({
    name: {
        type: String,
        default: "",
    },
    description: {
        type: String,
        default: "",
    },
    private: {
        type: Boolean,
        default: false,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
        autopopulate: true,
    },
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
        autopopulate: true,
    }],
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "ChatMessage",
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

groupChatSchema.pre("find", (next) => {
    ChatMessage;
    User;
    next();
})

groupChatSchema.post("findOneAndDelete", (doc, next) => {
    console.log("this.getQuery()")
    ChatMessage.deleteMany({ _id: { $in: doc.messages } }).exec();
    next();
})

export default mongoose.models.GroupChat || mongoose.model('GroupChat', groupChatSchema);
