import User from "@/model/User"
import { NextRequest } from "next/server";
import { object, string } from "yup"

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const filterString = searchParams.get('filter')
        const filterObj = filterString?.split(";").reduce((obj, item) => {
            return {
                ...obj,
                [item.split("=")[0]]: item.split("=")[1],
            }
        }, {});

        const result = await User.find(filterObj ?? {});

        return Response.json(result)
    } catch (error) {
        console.error(error)
        return new Response("Erro ao encontrar mensagens: " + error, { status: 500 })
    }
}

export async function PATCH(request: Request) {
    const bodySchema = object({
        email: string().required(),
        nome: string().required(),
        senha: string().required(),
    })
    try {
        const { searchParams } = new URL(request.url)
        const _id = searchParams.get('_id')
        const body = await request.json()
        await bodySchema.validate(body)
        const update = await User.findOneAndUpdate({ _id: _id }, {
            $set: {
                ...body
            }
        }, { new: true });

        return Response.json(update);
    } catch (error: any) {
        return new Response(`Erro ao atualizar usuário: ${error}`, { status: 500 })
    }
}


export async function DELETE(request: Request) {
    const bodySchema = object({
        _id: string().required()
    })
    try {
        const body = await request.json()
        await bodySchema.validate(body)
        const deleted = await User.findOneAndDelete(body);

        return Response.json(deleted);
    } catch (error: any) {
        return new Response(`Erro ao deletar usuário: ${error}`, { status: 500 })
    }
}