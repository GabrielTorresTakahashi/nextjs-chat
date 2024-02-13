import mongoose from "@/database";
import { genSalt, hash } from "bcryptjs";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    nome: {
        type: String,
        required: true,
        trim: true,
    },
    senha: {
        type: String,
        required: true,
        trim: true,
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

userSchema.pre('save', async function (next) {
    this.updatedAt = new Date();
    next()
})

userSchema.pre('save', async function (next) {
    const user = this;

    if (!user.isModified('senha')) return next();

    try {
        const salt = await genSalt(10);
        const hashed = await hash(user.senha, salt);
        user.senha = hashed;
        next();
    } catch (error: any) {
        console.error(error)
        return next(error);
    }
});

export default mongoose.models.User || mongoose.model('User', userSchema);
