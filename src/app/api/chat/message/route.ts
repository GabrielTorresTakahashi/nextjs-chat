import ChatMessage from "@/model/ChatMessage";
import { NextRequest } from "next/server";
import { array, object, string } from "yup";

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

        const messages = await ChatMessage.find(filterObj ?? {});

        return Response.json(messages)
    } catch (error) {
        return new Response("Erro ao encontrar mensagens: " + error, { status: 500 })
    }
}

export async function POST(request: Request) {
    const bodySchema = object({
        text: string().required(),
        sender: string().required(),
    })
    try {
        const body = await request.json();
        await bodySchema.validate(body)
        const group = await ChatMessage.create(body);
        return Response.json(group)
    } catch (error) {
        return new Response("Erro ao criar mensagens: " + error, { status: 500 })
    }
}

export async function PATCH(request: Request) {
    const bodySchema = object({
        text: string().required(),
        sender: string().required(),
    })
    try {
        const { searchParams } = new URL(request.url)
        const _id = searchParams.get('_id')
        const body = await request.json()
        await bodySchema.validate(body)
        const update = await ChatMessage.findOneAndUpdate({ _id: _id }, {
            $set: {
                ...body
            }
        }, { new: true });

        return Response.json(update);
    } catch (error: any) {
        return new Response(`Erro ao atualizar mensagem: ${error}`, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    const bodySchema = object({
        _id: string().required()
    })
    try {
        const body = await request.json()
        await bodySchema.validate(body)
        const deleted = await ChatMessage.findOneAndDelete(body);

        return Response.json(deleted);
    } catch (error: any) {
        return new Response(`Erro ao deletar mensagem: ${error}`, { status: 500 })
    }
}