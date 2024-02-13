const { config } = require('dotenv');
const { createServer } = require('http');
const { verify } = require('jsonwebtoken');
require('dotenv'), config();

const { Server } = require("socket.io")

const httpServer = createServer();

const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000"
    },
});

io.on("connection", (socket) => {
    socket.on("join_room", (chatInfo) => {
        const { chatId } = chatInfo;
        socket.join(chatId);
        console.log(`user with id-${socket.id} joined room - ${chatId}`);
    });

    socket.on("send_msg", (data, onEnd) => {
        try {
            const { sender, to, text } = data
            socket.to(to).emit("receive_msg", { sender, to, text });
            onEnd({ sender, to, text });
        } catch (e) {
            console.log(e)
            onEnd({ error: e });
        }
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected:", socket.id);
    });
});

const PORT = 4001;
httpServer.listen(PORT, () => {
    console.log(`Socket.io server is running on port ${PORT}`);
});
