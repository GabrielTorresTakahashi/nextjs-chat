import mongoose from "@/database";
import { hash } from "bcryptjs";

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

    // Apenas criptografar a senha se ela foi modificada ou é um novo usuário
    if (!user.isModified('senha')) return next();

    try {
        // Gerar o hash da senha com uma "força" de 10
        const hashed = await hash(user.senha, process.env.MY_PASSWORD || "");
        user.senha = hashed;
        next();
    } catch (error: any) {
        return next(error);
    }
});

export default mongoose.models.User || mongoose.model('User', userSchema);
