import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express()
const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000"],
    },
})
const userSocketMap = {}

io.on("connection", (socket) => {
    console.log("A user connected:", socket.id)
    const userID = socket.handshake.query.userID
    if (userID) {
        userSocketMap[userID] = socket.id
        console.log(`${userID} connected. Socket ID: ${socket.id}`)
    }
    io.emit("getOnlineUsers", Object.keys(userSocketMap))
    socket.on("disconnect", () => {
        console.log("Disconnected:", socket.id)
        delete userSocketMap[userID]
        io.emit("getOnlineUsers", Object.keys(userSocketMap))
    })
})

export function getReceiverSocketID(userID) {
    return userSocketMap[userID]
}
export { io, app, server }