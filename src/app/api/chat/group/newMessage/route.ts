import GroupChat from "@/model/GroupChat"
import { object, string } from "yup"

export async function PATCH(request: Request) {
    const bodySchema = object({
        message: string().required(),
    })
    try {
        const { searchParams } = new URL(request.url)
        const _id = searchParams.get('groupId')
        const body = await request.json()
        await bodySchema.validate(body)
        const update = await GroupChat.findOneAndUpdate({ _id: _id }, {
            $push: {messages: body.message}
        }, { new: true });

        return Response.json(update);
    } catch (error: any) {
        return new Response(`Erro ao atualizar grupo: ${error}`, { status: 500 })
    }
}