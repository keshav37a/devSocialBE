import express from 'express'

import { adminAuth, userAuth } from '#Middlewares/auth'

import {
    deleteConnectionRequestByConnectionRequestId,
    deleteConnectionRequestByEmail,
    deleteConnectionRequestByUserId,
    getAllConnectionRequests,
    getConnectionsByUser,
    getPendingConnectionRequestsForReviewByUser,
    reviewConnectionRequest,
    sendConnectionRequest,
} from '#Controllers/connectionController'

const router = express.Router()

/* Admin routes */
router.get('/all', adminAuth, getAllConnectionRequests)
router.delete('/delete/email', adminAuth, deleteConnectionRequestByEmail)
router.delete('/delete/user-id', userAuth, deleteConnectionRequestByUserId)
router.delete(
    '/delete/connection-request-id/:connectionRequestId',
    adminAuth,
    deleteConnectionRequestByConnectionRequestId
)

/* Customer routes */
router.post('/send/:status/:toUser', userAuth, sendConnectionRequest)
router.get('/review-requests', userAuth, getPendingConnectionRequestsForReviewByUser)
router.get('/connections', userAuth, getConnectionsByUser)
router.post('/review/:status/:connectionRequestId', userAuth, reviewConnectionRequest)

export const connectionRequestRoutes = router
