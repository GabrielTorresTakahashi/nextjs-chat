import User from "@/model/User";
import { JwtPayload, verify } from "jsonwebtoken";
import { NextRequest } from "next/server";

interface DecodedUser extends JwtPayload {
    _id: string;
    iat: number;
}

export async function GET(request: NextRequest) {

    try {
        
        const token = request.headers.get("Authorization");
        if (!token) {
            console.error("Erro ao obter Token")
            throw Error("Erro ao obter Token")
        }
        if (!process.env.MY_PASSWORD) {
            console.error("Erro ao obter Salt")
            throw Error("Erro ao obter Salt")
        }
        const user = verify(token, process.env.MY_PASSWORD ?? "password") as DecodedUser
        if (!user) {
            console.error("Erro ao decifrar autorização")
            throw Error("Erro ao decifrar autorização")
        }
        const result = await User.findOne({ _id: user._id } ?? {});

        return Response.json(result)
    } catch (error) {
        return new Response("Erro ao encontrar mensagens: " + error, { status: 500 })
    }
}