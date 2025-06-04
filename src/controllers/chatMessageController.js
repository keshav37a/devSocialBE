import { ChatMessageModel } from '#Models/chatMessageModel'

import { sendStandardResponse } from '#Utils/responseUtils'

export const joinRoomController = (socket, { fromUserId, toUserId }) => {
    try {
        const roomId = getRoomId({ fromUserId, toUserId })
        socket.join(roomId)
        console.log(`Socket ${socket.id} joined room ${roomId}`)
        socket.to(roomId).emit('USER_JOINED_ROOM', { userId: fromUserId, roomId })
    } catch (err) {
        console.error(err)
    }
}

export const getRoomId = ({ fromUserId, toUserId }) => `${fromUserId}${toUserId}`.split('').sort().join('')

export const sendAndSaveChatMessageController = async (socket, { fromUserId, toUserId, message }) => {
    try {
        const roomId = getRoomId({ fromUserId, toUserId })

        /* Emit receive message event */
        socket.to(roomId).emit('RECEIVE_MESSAGE', { fromUserId, toUserId, roomId, message })

        console.log({ fromUserId, toUserId, message, roomId })

        /* Save new message in DB */
        const newChatMessage = ChatMessageModel({ fromUser: fromUserId, toUser: toUserId, message, roomId })
        await newChatMessage.save()
    } catch (err) {
        console.error(err)
    }
}

export const getChatMessages = async (req, res) => {
    try {
        const roomId = req.params.roomId
        const params = roomId === 'all' ? {} : { roomId }
        const chatMessages = await ChatMessageModel.find(params)
        sendStandardResponse(res, {
            message: 'Chat messages fetched successfully',
            data: { chatMessages },
        })
    } catch (error) {
        sendStandardResponse(res, { message: error.message, data: { chatMessages: null }, error })
    }
}

/* Admin route */
export const getAllChatMessages = async (req, res) => {
    try {
        const chatMessages = await ChatMessageModel.find()
        sendStandardResponse(res, {
            message: 'Chat messages fetched successfully',
            data: { chatMessages },
        })
    } catch (error) {
        sendStandardResponse(res, { message: error.message, data: { chatMessages: null }, error })
    }
}
