import { ChatMessageModel } from '#Models/chatMessageModel'
import { ChatRoomModel } from '#Models/chatRoomModel'

import { sendStandardResponse } from '#Utils/responseUtils'

export const deleteAllChatMessages = async (_, res) => {
    /* Admin controller only */
    try {
        const deletedMessagesData = await ChatMessageModel.deleteMany({})
        const modifiedChatRoomData = await ChatRoomModel.updateMany(
            {},
            {
                $set: {
                    messages: [],
                    lastMessage: null,
                },
            }
        )
        sendStandardResponse(res, {
            message: 'Chat messages deleted successfully',
            data: {
                chatMessage: deletedMessagesData,
                chatRoom: modifiedChatRoomData,
            },
        })
    } catch (error) {
        sendStandardResponse(res, { message: error.message, data: { chatMessages: null }, error })
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

export const getAllChatRooms = async (_, res) => {
    /* Admin controller only */
    try {
        // TODO: Remove populate
        const chatRooms = await ChatRoomModel.find().populate('participants').populate('messages')
        sendStandardResponse(res, {
            message: 'Chat rooms fetched successfully',
            data: { chatRooms },
        })
    } catch (error) {
        sendStandardResponse(res, { message: error.message, data: { chatRooms: null }, error })
    }
}

export const getChatRoomByParticipants = async (req, res) => {
    try {
        const { participants } = req.body
        const chatRoom = await ChatRoomModel.find({ participants })
        sendStandardResponse(res, {
            message: 'Chat room fetched successfully',
            data: { chatRoom },
        })
    } catch (error) {
        sendStandardResponse(res, { message: error.message, data: { chatRoom: null }, error })
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
