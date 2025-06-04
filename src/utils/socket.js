import { Server } from 'socket.io'

import { createServer } from 'node:http'

import { joinRoomController, sendAndSaveChatMessageController } from '#Controllers/chatMessageController'

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
            joinRoomController(socket, { fromUser, toUser })
        })
        socket.on('SEND_MESSAGE', ({ fromUser, toUser, message, sentAt }) => {
            console.log({ fromUser, toUser, message })
            sendAndSaveChatMessageController(socket, { fromUser, toUser, message, sentAt })
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
