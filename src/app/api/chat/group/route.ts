import GroupChat from "@/model/GroupChat"
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

        const result = await GroupChat.find(filterObj ?? {});

        return Response.json(result)
    } catch (error) {
        return new Response("Erro ao encontrar mensagens: " + error, { status: 500 })
    }
}

export async function POST(request: Request) {
    const bodySchema = object({
        name: string().required(),
        users: array().of(string()).default([]),
    })
    try {
        const body = await request.json();
        await bodySchema.validate(body)
        const group = await GroupChat.create(body);
        return Response.json(group)
    } catch (error) {
        return new Response("Error getting groups: " + error, { status: 500 })
    }
}

export async function PATCH(request: Request) {
    const bodySchema = object({
        name: string().required(),
        users: array().of(string()).default([]),
    })
    try {
        const { searchParams } = new URL(request.url)
        const _id = searchParams.get('_id')
        const body = await request.json()
        await bodySchema.validate(body)
        const update = await GroupChat.findOneAndUpdate({ _id: _id }, {
            $set: {
                ...body
            }
        }, { new: true });

        return Response.json(update);
    } catch (error: any) {
        return new Response(`Erro ao atualizar grupo: ${error}`, { status: 500 })
    }
}

export async function DELETE(request: NextRequest) {
    const querySchema = object({
        _id: string().required()
    })
    try {
        const { searchParams } = new URL(request.url)
        const _id = searchParams.get('_id')
        const deleted = await GroupChat.findOneAndDelete({ _id });

        return Response.json(deleted);
    } catch (error: any) {
        return new Response(`Erro ao deletar grupo: ${error}`, { status: 500 })
    }
}