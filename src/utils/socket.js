import { Server } from 'socket.io'

import { createServer } from 'node:http'

import { joinRoom, sendAndSaveChatMessage, updateChatMessageReadStatus } from '#Controllers/chatMessageController'

export const initializeSocket = (expressServer) => {
    console.log('initializeSocket called')
    const httpServer = createServer(expressServer)
    const io = new Server(httpServer, {
        cors: {
            origin: 'http://localhost:5173', // React app origin
            methods: ['GET', 'POST'],
        },
    })

    io.on('connection', (socket) => {
        console.log('on connection: socket.connected ', socket.connected)
        socket.on('JOIN_ROOM', ({ fromUser, toUser }) => {
            joinRoom(socket, { fromUser, toUser })
        })
        socket.on('SEND_MESSAGE', ({ fromUser, toUser, message, sentAt }) => {
            console.log({ fromUser, toUser, message })
            sendAndSaveChatMessage(socket, io, { fromUser, toUser, message, sentAt })
        })
        socket.on('READ_MESSAGE', ({ messageId, readAt, roomId }) => {
            console.log({ messageId, readAt })
            updateChatMessageReadStatus(socket, { messageId, readAt, roomId, isRead: true })
        })
        socket.on('disconnect', () => {
            console.log('user disconnected')
            console.log('disconnect on connection: socket.connected ', socket.connected)
        })
        socket.on('close', () => {
            console.log('socket closed')
        })
    })

    return httpServer
}
