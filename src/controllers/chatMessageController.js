import { ChatMessageModel } from '#Models/chatMessageModel'

import { sendStandardResponse } from '#Utils/responseUtils'

export const deleteAllChatMessages = async (req, res) => {
    /* Admin controller only */
    try {
        const deletedData = await ChatMessageModel.deleteMany({})
        sendStandardResponse(res, {
            message: 'Chat messages deleted successfully',
            data: deletedData,
        })
    } catch (error) {
        sendStandardResponse(res, { message: error.message, data: { chatMessages: null }, error })
    }
}

export const joinRoomController = (socket, { fromUser, toUser }) => {
    try {
        const roomId = getRoomId({ fromUser, toUser })
        socket.join(roomId)
        console.log(`Socket ${socket.id} joined room ${roomId}`)
        socket.to(roomId).emit('USER_JOINED_ROOM', { userId: fromUser, roomId })
    } catch (err) {
        console.error(err)
    }
}

export const getRoomId = ({ fromUser, toUser }) => `${fromUser}${toUser}`.split('').sort().join('')

export const sendAndSaveChatMessageController = async (socket, { fromUser, toUser, message, sentAt }) => {
    try {
        const roomId = getRoomId({ fromUser, toUser })
        const receivedAt = new Date()
        const chatMessageData = { fromUser, message, receivedAt, roomId, sentAt, toUser }

        /* Emit receive message event */
        socket.to(roomId).emit('RECEIVE_MESSAGE', chatMessageData)

        console.log(chatMessageData)

        /* Save new message in DB */
        const newChatMessage = ChatMessageModel(chatMessageData)
        await newChatMessage.save()
    } catch (err) {
        console.error(err)
    }
}

export const getChatMessages = async (req, res) => {
    try {
        const roomId = req.params.roomId
        const chatMessages = await ChatMessageModel.find({ roomId })
        sendStandardResponse(res, {
            message: 'Chat messages fetched successfully',
            data: { chatMessages },
        })
    } catch (error) {
        sendStandardResponse(res, { message: error.message, data: { chatMessages: null }, error })
    }
}

export const getAllChatMessages = async (req, res) => {
    /* Admin controller only */
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
