import express from 'express'

import { adminAuth, userAuth } from '#Middlewares/auth'

import { deleteAllChatMessages, getAllChatMessages, getChatMessages } from '#Controllers/chatMessageController'

const router = express.Router()

/* Customer routes */
router.get('/messages/room/:roomId', userAuth, getChatMessages)

/* Admin routes */
router.get('/messages/all', adminAuth, getAllChatMessages)
router.delete('/delete/all', adminAuth, deleteAllChatMessages)

export const chatMessageRoutes = router
