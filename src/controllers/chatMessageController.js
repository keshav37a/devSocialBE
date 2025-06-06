import { ChatMessageModel } from '#Models/chatMessageModel'

import { sendStandardResponse } from '#Utils/responseUtils'

export const deleteAllChatMessages = async (_, res) => {
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

export const joinRoom = (socket, { fromUser, toUser }) => {
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

export const sendAndSaveChatMessage = async (socket, io, { fromUser, toUser, message, sentAt }) => {
    try {
        const roomId = getRoomId({ fromUser, toUser })
        const receivedAt = new Date()
        const chatMessageData = { fromUser, message, receivedAt, roomId, sentAt, toUser }

        /* Emit receive message event */
        socket.to(roomId).emit('RECEIVE_MESSAGE', chatMessageData)

        /* Save new message in DB */
        const newChatMessage = ChatMessageModel(chatMessageData)

        /* Update event (_id) new message for client  */
        io.to(roomId).emit('SAVE_MESSAGE', newChatMessage)

        await newChatMessage.save()
    } catch (err) {
        console.error(err)
    }
}

export const getChatMessagesByRoomId = async (req, res) => {
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

export const getAllChatMessages = async (_, res) => {
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

export const updateChatMessage = async (req, res) => {
    /* Admin controller only */
    try {
        const { _id: messageId, ...restMessageProps } = req.body
        const chatMessage = await ChatMessageModel.findByIdAndUpdate(messageId, { ...restMessageProps }, { new: true })
        sendStandardResponse(res, {
            message: 'Chat messages updated successfully',
            data: { chatMessage },
        })
    } catch (error) {
        sendStandardResponse(res, { message: error.message, data: { chatMessage: null }, error })
    }
}

export const updateChatMessageReadStatus = async (socket, { messageId, readAt, roomId, isRead }) => {
    try {
        /* Update event (_id) new message for client  */
        socket.to(roomId).emit('READ_MESSAGE', { messageId, readAt, roomId, isRead })
        await ChatMessageModel.findByIdAndUpdate(messageId, { isRead, readAt }, { new: true })
    } catch (error) {
        console.error(error)
    }
}
