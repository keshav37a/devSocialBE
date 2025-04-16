const express = require('express')

const {
    deleteUserByEmail,
    deleteUserById,
    getAllUsers,
    getUserById,
    getUserFeed,
    updateUser,
} = require('#Controllers/userController')
const { adminAuth, userAuth } = require('#Middlewares/auth')

const router = express.Router()

/* Admin only routes */
router.delete('/delete', adminAuth, deleteUserByEmail)
router.delete('/delete/user-id/:userId', adminAuth, deleteUserById)
router.get('/all', adminAuth, getAllUsers)
router.get('/user-id/:userId', adminAuth, getUserById)
router.patch('/update/:userId', adminAuth, updateUser)

/* Customer routes */
router.get('/feed', userAuth, getUserFeed)

module.exports = {
    userRoutes: router,
}
