const express = require('express')

const { getUserProfile, updateUserProfile, changePasswordAsSignedInUser } = require('#Controllers/profileController')
const { userAuth } = require('#Middlewares/auth')

const router = express.Router()

/* Customer routes */
router.post('/change-password', userAuth, changePasswordAsSignedInUser)
router.patch('/edit', userAuth, updateUserProfile)
router.get('/view', userAuth, getUserProfile)

module.exports = {
    profileRoutes: router,
}
