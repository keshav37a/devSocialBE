import { Server } from 'socket.io'

import { createServer } from 'node:http'

import {
    emitUserTypingEvent,
    joinRoom,
    sendAndSaveChatMessage,
    updateChatMessageReadStatus,
} from '#Controllers/chatController'

export const initializeSocket = (expressServer) => {
    const httpServer = createServer(expressServer)
    const io = new Server(httpServer, {
        cors: {
            origin: 'http://localhost:5173', // React app origin
            methods: ['GET', 'POST'],
        },
    })

    io.on('connection', (socket) => {
        socket.on('JOIN_ROOM', ({ fromUser, participants }) => joinRoom(socket, { fromUser, participants }))

        socket.on('SEND_MESSAGE', ({ fromUser, message, participants, sentAt }) =>
            sendAndSaveChatMessage(socket, io, { fromUser, message, participants, sentAt })
        )

        socket.on('READ_MESSAGE', ({ messageId, readBy, participants }) =>
            updateChatMessageReadStatus(socket, { messageId, readBy, participants })
        )

        socket.on('USER_TYPING', ({ fromUser, participants }) =>
            emitUserTypingEvent(socket, { fromUser, participants })
        )

        socket.on('disconnect', () => {
            console.log('user disconnected')
        })

        socket.on('close', () => {
            console.log('socket closed')
        })
    })

    return httpServer
}
