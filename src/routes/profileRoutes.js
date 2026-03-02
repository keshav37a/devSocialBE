import express from 'express'
import multer from 'multer'

import { userAuth } from '#Middlewares/auth'

import { attachParams, uploadImage } from '#Services/cloudinaryService'

import { changePasswordAsSignedInUser, getUserProfile, updateUserProfile } from '#Controllers/profileController'

const router = express.Router()

const storage = multer.memoryStorage()
const fileUpload = multer({ storage })

/* Customer routes */
router.post('/change-password', userAuth, changePasswordAsSignedInUser)
router.patch(
    '/edit',
    userAuth,
    fileUpload.single('profilePic'),
    (req, res, next) =>
        attachParams([
            {
                key: 'cloudinaryFolderPath',
                value: `user/${req.user._id}/dp`,
            },
            {
                key: 'cloudinaryFileName',
                value: `${req.user._id}_dp`,
            },
        ])(req, res, next),
    uploadImage,
    updateUserProfile
)
router.get('/view', userAuth, getUserProfile)

export const profileRoutes = router
