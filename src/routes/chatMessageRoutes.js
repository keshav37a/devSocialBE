import express from 'express'

import { adminAuth, userAuth } from '#Middlewares/auth'

import {
    deleteAllChatMessages,
    getAllChatMessages,
    getChatMessagesByRoomId,
    updateChatMessage,
} from '#Controllers/chatMessageController'

const router = express.Router()

/* Customer routes */
router.get('/messages/room/:roomId', userAuth, getChatMessagesByRoomId)

/* Admin routes */
router.get('/messages/all', adminAuth, getAllChatMessages)
router.delete('/delete/all', adminAuth, deleteAllChatMessages)
router.patch('/message/update', adminAuth, updateChatMessage)

export const chatMessageRoutes = router
