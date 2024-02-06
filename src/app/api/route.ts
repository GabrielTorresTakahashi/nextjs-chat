import User from "@/model/User"

export async function GET() {

    return Response.json({ hello: "server" })
}
