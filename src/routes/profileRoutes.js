import express from 'express'

import { userAuth } from '#Middlewares/auth'

import { changePasswordAsSignedInUser, getUserProfile, updateUserProfile } from '#Controllers/profileController'

const router = express.Router()

/* Customer routes */
router.post('/change-password', userAuth, changePasswordAsSignedInUser)
router.patch('/edit', userAuth, updateUserProfile)
router.get('/view', userAuth, getUserProfile)

export const profileRoutes = router
