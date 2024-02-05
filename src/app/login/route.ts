import axios from "axios"

export async function GET(request: Request) {
    const res = await axios.get("https://pokeapi.co/api/v2/pokemon/ditto")
    const data = res.data

    return Response.json({ data })
}