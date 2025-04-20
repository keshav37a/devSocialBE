import express from 'express'

import {
    bulkUpdateUsers,
    deleteUserByEmail,
    deleteUserById,
    getAllUsers,
    getUserById,
    getUserFeed,
    updateUser,
} from '#Controllers/userController'
import { adminAuth, userAuth } from '#Middlewares/auth'

const router = express.Router()

/* Admin only routes */
router.post('/bulk-update', adminAuth, bulkUpdateUsers)
router.delete('/delete', adminAuth, deleteUserByEmail)
router.delete('/delete/user-id/:userId', adminAuth, deleteUserById)
router.get('/all', adminAuth, getAllUsers)
router.get('/user-id/:userId', adminAuth, getUserById)
router.patch('/update/:userId', adminAuth, updateUser)

/* Customer routes */
router.get('/feed', userAuth, getUserFeed)

export const userRoutes = router
