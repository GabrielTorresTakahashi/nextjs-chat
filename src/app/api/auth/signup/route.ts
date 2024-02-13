import User from "@/model/User";
import { object, string } from "yup";

export async function POST(request: Request) {
    const bodySchema = object({
        email: string().required(),
        nome: string().required(),
        senha: string().required(),
    })
    try {
        const body = await request.json()
        await bodySchema.validate(body)
        const exists = await User.findOne({ email: body.email });
        if (exists) {
            return new Response(`Erro ao criar usuário: Usuário já existe`, { status: 404 })
        }
        const created = await User.create(body);

        return Response.json(created);
    } catch (error: any) {
        return new Response(`Erro ao criar usuário: ${error}`, { status: 500 })
    }
}