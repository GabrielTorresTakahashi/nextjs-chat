import User from "@/model/User"
import { compare } from "bcryptjs"
import { sign } from "jsonwebtoken";
import { object, string } from "yup"
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
    const bodySchema = object({
        email: string().required(),
        senha: string().required(),
    })
    try {
        const body = await request.json();
        await bodySchema.validate(body)

        const user = await User.findOne({ email: body.email });

        const valid = await compare(body.senha, user.senha)
        if (!valid) {
            return new NextResponse(`Usuário ou senha incorretos ${valid}`, { status: 401 })
        }
        const token = sign({ _id: user._id }, process.env.MY_PASSWORD ?? "password")
        const response = NextResponse.json({ token })
        cookies().set("token", token)
        response.cookies.set("token", token)
        return response
    } catch (error) {
        return new NextResponse(`Erro ao fazer login: ${error}`, { status: 500 })
    }
}