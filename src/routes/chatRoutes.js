import express from 'express'

import { adminAuth, userAuth } from '#Middlewares/auth'

import {
    deleteAllChatMessages,
    getAllChatMessages,
    getAllChatRooms,
    getChatMessagesByRoomId,
    getChatRoomByParticipants,
    updateChatMessage,
} from '#Controllers/chatController'

const router = express.Router()

/* Customer routes */
router.post('/messages/participants', userAuth, getChatMessagesByRoomId)
router.post('/chat-room/participants', userAuth, getChatRoomByParticipants)

/* Admin routes */
router.get('/chat-room/all', adminAuth, getAllChatRooms)
router.get('/messages/all', adminAuth, getAllChatMessages)
router.delete('/delete/all', adminAuth, deleteAllChatMessages)
router.patch('/message/update', adminAuth, updateChatMessage)

export const chatMessageRoutes = router
