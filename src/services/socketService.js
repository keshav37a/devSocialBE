import { Server } from 'socket.io'

import { createServer } from 'node:http'

import { FRONTEND_DEV_URL, FRONTEND_PROD_URL } from '#Config/keys'

import {
    emitUserTypingEvent,
    joinRoom,
    sendAndSaveChatMessage,
    updateChatMessageReadStatus,
} from '#Controllers/chatController'

export const initializeSocket = (expressServer, isProd) => {
    const httpServer = createServer(expressServer)
    const io = new Server(httpServer, {
        cors: {
            origin: isProd ? FRONTEND_PROD_URL : FRONTEND_DEV_URL,
            methods: ['GET', 'POST'],
            credentials: true,
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
