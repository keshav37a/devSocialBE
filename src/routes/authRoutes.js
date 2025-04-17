import express from 'express'

import { signInUser, signOutUser, signUpNewUser } from '#Controllers/authController'

const router = express.Router()

/* Customer routes */
router.post('/signin', signInUser)
router.post('/signout', signOutUser)
router.post('/signup', signUpNewUser)

export const authRoutes = router
