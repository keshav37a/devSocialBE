import { hash } from 'bcrypt'

import { validateChangePasswordAsSignedInUser, validateUpdateUserProfile } from '#Validations/profileValidation'

import { throwIncorrectPasswordError, throwUserForbiddenError } from '#Utils/errorUtils'
import { sendStandardResponse } from '#Utils/responseUtils'

import { USER } from '#Config/keys'

export const changePasswordAsSignedInUser = async (req, res) => {
    try {
        validateChangePasswordAsSignedInUser(req)
        const user = req.user

        const { currentPassword, newPassword } = req.body

        const isPasswordValid = await user.validatePassword(currentPassword)

        if (!isPasswordValid) {
            throwIncorrectPasswordError()
        }

        const newPasswordHash = await hash(newPassword, USER.PASSWORD_SALT_ROUNDS)
        user.password = newPasswordHash

        await user.save()

        sendStandardResponse(res, { message: 'password changed successfully', data: { _id: user._id } })
    } catch (error) {
        sendStandardResponse(res, { message: error.message, data: { user: null }, error })
    }
}

export const getUserProfile = (req, res) => {
    try {
        const user = req.user
        if (!user) {
            throwUserForbiddenError()
        }
        sendStandardResponse(res, { message: 'User profile fetched successfully', data: { user } })
    } catch (error) {
        sendStandardResponse(res, { message: error.message, data: { user: null }, error })
    }
}

export const updateUserProfile = async (req, res) => {
    try {
        validateUpdateUserProfile(req)
        const user = req.user
        Object.keys(req.body).forEach((key) => {
            // eslint-disable-next-line security/detect-object-injection
            user[key] = req.body[key]
        })
        await user.save()
        sendStandardResponse(res, { message: 'user updated successfully', data: { user } })
    } catch (error) {
        sendStandardResponse(res, { message: error.message, data: { user: null }, error })
    }
}
