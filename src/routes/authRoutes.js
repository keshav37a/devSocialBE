const express = require('express')

const { signInUser, signOutUser, signUpNewUser } = require('#Controllers/authController')

const router = express.Router()

/* Customer routes */
router.post('/signin', signInUser)
router.post('/signout', signOutUser)
router.post('/signup', signUpNewUser)

module.exports = {
    authRoutes: router,
}
