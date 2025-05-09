import express from 'express'

import { adminAuth, userAuth } from '#Middlewares/auth'

import {
    bulkUpdateUsers,
    deleteUserByEmail,
    deleteUserById,
    getAllUsers,
    getUserById,
    getUserFeed,
    sendEmailToUser,
    updateUser,
} from '#Controllers/userController'

const router = express.Router()

/* Admin only routes */
router.post('/bulk-update', adminAuth, bulkUpdateUsers)
router.delete('/delete', adminAuth, deleteUserByEmail)
router.delete('/delete/user-id/:userId', adminAuth, deleteUserById)
router.get('/all', adminAuth, getAllUsers)
router.get('/user-id/:userId', adminAuth, getUserById)
router.patch('/update/:userId', adminAuth, updateUser)
router.post('/email/send', adminAuth, sendEmailToUser)

/* Customer routes */
router.get('/feed', userAuth, getUserFeed)

export const userRoutes = router
