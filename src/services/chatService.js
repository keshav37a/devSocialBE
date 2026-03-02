import { Server } from 'socket.io'

import crypto from 'crypto'
import { createServer } from 'node:http'

import { ChatMessageModel } from '#Models/chatMessageModel'
import { ChatRoomModel } from '#Models/chatRoomModel'

import { FRONTEND_DEV_URL, FRONTEND_PROD_URL } from '#Config/keys'

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

export const joinRoom = (socket, { fromUser, participants }) => {
    try {
        const roomId = getRoomId(participants)
        socket.join(roomId)
        socket.to(roomId).emit('USER_JOINED_ROOM', { userId: fromUser, roomId })
    } catch (err) {
        console.error(err)
    }
}

export const getRoomId = (participants) => {
    const participantsString = participants.sort().join('_')
    return crypto.createHash('sha256').update(participantsString).digest('hex')
}

export const sendAndSaveChatMessage = async (socket, io, { fromUser, message, participants, sentAt }) => {
    try {
        const roomId = getRoomId(participants)
        const receivedAt = new Date()

        const newChatMessageData = { fromUser, message, receivedAt, sentAt, participants }

        /* Emit receive message event */
        socket.to(roomId).emit('RECEIVE_MESSAGE', newChatMessageData)

        /* Fetch or create new chat room */
        let chatRoom = await ChatRoomModel.findOne({ participants })
        if (!chatRoom) {
            chatRoom = ChatRoomModel({ participants })
        }

        /* Save new message in DB */
        newChatMessageData.chatRoom = chatRoom._id

        const newChatMessage = ChatMessageModel(newChatMessageData)
        const newChatMessageId = newChatMessage._id

        chatRoom.messages.push(newChatMessageId)
        chatRoom.lastMessage = newChatMessageId

        await newChatMessage.save()
        await chatRoom.save()

        /* Update event (_id) new message for client  */
        newChatMessageData.messageId = newChatMessageId
        io.to(roomId).emit('SAVE_MESSAGE', newChatMessageData)
    } catch (err) {
        console.error(err)
    }
}

export const updateChatMessageReadStatus = async (socket, { messageId, readBy, participants }) => {
    try {
        /* Update event (_id) new message for client  */
        const roomId = getRoomId(participants)
        socket.to(roomId).emit('READ_MESSAGE', { messageId, readBy, participants })
        const messageToBeUpdated = await ChatMessageModel.findById(messageId)

        if (!messageToBeUpdated) {
            throw new Error('Message not found')
        }

        /* Check if the user has already read the message */
        const hasUserRead = messageToBeUpdated.readBy.some((entry) => entry.user.toString() === readBy.user)

        if (!hasUserRead) {
            messageToBeUpdated.readBy.push(readBy)
            await messageToBeUpdated.save()
        }
    } catch (error) {
        console.error(error)
    }
}

export const emitUserTypingEvent = (socket, { participants, fromUser }) => {
    try {
        const roomId = getRoomId(participants)
        socket.to(roomId).emit('USER_TYPING', { participants, fromUser })
    } catch (error) {
        console.error(error)
    }
}
