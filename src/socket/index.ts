import { Server } from "socket.io";
import { createServer } from "http";

const httpServer = createServer();
const io = new Server(httpServer, { /* options */ });

type RoomParams = {
    room: string;
    username: string;
}

type MessageParams = {
    content: string;
    sender: string | object;
    room: string;
}

io.on("connecion", (socket) => {
    console.log("Um usuário se conectou");

    socket.on("join", (roomParams: RoomParams, onEnd: (args: any) => void) => {
        const { room, username } = roomParams;

        if (!room || !username) {
            onEnd({ error: `Erro ao juntar-se à sala: nome de usuário ou sala não definidos.` });
        }

        socket.join(room);

        onEnd({ success: `${username} se juntou à sala ${room}` })
    });

    socket.on("message", (messageParams: MessageParams, onEnd: (args: any) => void) => {
        const { content, sender, room } = messageParams;
        if (!content || !sender || !room) {
            onEnd({ error: `Defina os parâmetros da mensagem. ({room, sender, content})` })
        }

        socket.to(room).emit("message", { content, sender, room });

        onEnd({ message: content, sender: sender })
    })


})