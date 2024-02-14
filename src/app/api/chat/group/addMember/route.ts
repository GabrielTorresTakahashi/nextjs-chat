import GroupChat from "@/model/GroupChat"
import { object, string } from "yup"

export async function PATCH(request: Request) {
    const bodySchema = object({
        group: string().required(),
        member: string().required(),
    })
    try {
        const body = await request.json()
        await bodySchema.validate(body)
        const { group, member } = body;
        const update = await GroupChat.findOneAndUpdate({ _id: group }, {
            $push: { users: member }
        }, { new: true });

        return Response.json(update);
    } catch (error: any) {
        return new Response(`Erro ao atualizar grupo: ${error}`, { status: 500 })
    }
}