import express from 'express'

import { changePasswordAsSignedInUser, getUserProfile, updateUserProfile } from '#Controllers/profileController'
import { userAuth } from '#Middlewares/auth'

const router = express.Router()

/* Customer routes */
router.post('/change-password', userAuth, changePasswordAsSignedInUser)
router.patch('/edit', userAuth, updateUserProfile)
router.get('/view', userAuth, getUserProfile)

export const profileRoutes = router
