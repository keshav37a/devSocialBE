import { Server } from 'socket.io'

import { createServer } from 'node:http'

import {
    emitUserTypingEvent,
    joinRoom,
    sendAndSaveChatMessage,
    updateChatMessageReadStatus,
} from '#Controllers/chatMessageController'

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
        socket.on('JOIN_ROOM', ({ fromUser, toUser }) => joinRoom(socket, { fromUser, toUser }))

        socket.on('SEND_MESSAGE', ({ fromUser, toUser, message, sentAt }) =>
            sendAndSaveChatMessage(socket, io, { fromUser, toUser, message, sentAt })
        )

        socket.on('READ_MESSAGE', ({ messageId, readAt, roomId }) =>
            updateChatMessageReadStatus(socket, { messageId, readAt, roomId, isRead: true })
        )

        socket.on('USER_TYPING', ({ roomId }) => emitUserTypingEvent(socket, { roomId }))

        socket.on('disconnect', () => {
            console.log('user disconnected')
        })

        socket.on('close', () => {
            console.log('socket closed')
        })
    })

    return httpServer
}
