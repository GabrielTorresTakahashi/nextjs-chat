import mongoose from "@/database";
import { CallbackError } from "mongoose";
import bcrypt from 'bcrypt'

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
});

// Antes de salvar o usuário, criptografar a senha usando bcrypt
userSchema.pre('save', async function (next) {
    const user = this;

    // Apenas criptografar a senha se ela foi modificada ou é um novo usuário
    if (!user.isModified('senha')) return next();

    try {
        // Gerar o hash da senha com uma "força" de 10
        const hash = await bcrypt.hash(user.senha, 10);
        user.senha = hash;
        next();
    } catch (error: any) {
        return next(error);
    }
});

// Método para comparar senhas durante o login
userSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.senha);
    } catch (error) {
        throw error;
    }
};

const User = mongoose.model('User', userSchema);

export default User;
