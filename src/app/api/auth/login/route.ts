import User from "@/model/User"
import { compare } from "bcryptjs"
import { sign } from "jsonwebtoken";
import { object, string } from "yup"

export async function POST(request: Request) {
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
            return new Response(`Usuário ou senha incorretos ${valid}`, { status: 401 })
        }
        const token = sign({ _id: user._id }, process.env.MY_PASSWORD || "mysalt")
        return Response.json({ token })
    } catch (error) {
        return new Response(`Erro ao fazer login: ${error}`, { status: 500 })
    }


}