import express from 'express'

import { adminAuth, userAuth } from '#Middlewares/auth'

import { getAllChatMessages, getChatMessages } from '#Controllers/chatMessageController'

const router = express.Router()

/* Customer routes */
router.get('/messages/room/:roomId', userAuth, getChatMessages)

/* Admin routes */
router.get('/messages/all', adminAuth, getAllChatMessages)

export const chatMessageRoutes = router
