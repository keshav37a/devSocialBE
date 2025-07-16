import express from 'express'

import {
    forgotPassword,
    resetPassword,
    signInUser,
    signInUserWithGoogle,
    signOutUser,
    signUpNewUser,
} from '#Controllers/authController'

const router = express.Router()

/* Customer routes */
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)
router.post('/signin', signInUser)
router.post('/signin-google', signInUserWithGoogle)
router.post('/signout', signOutUser)
router.post('/signup', signUpNewUser)

export const authRoutes = router
