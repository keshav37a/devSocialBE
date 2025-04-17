import {
    throwInvalidUserProfileUpdateError,
    throwMissingDataError,
    throwSameCurrentPasswordNewPasswordError,
    throwUserForbiddenError,
} from '#Utils/errorUtils'

import { validateUserIdHelper } from '#Validations/userValidation'

export const validateChangePasswordAsSignedInUser = (req) => {
    const { currentPassword, newPassword } = req.body
    const user = req.user

    if (!user) {
        throwUserForbiddenError()
    }
    if (!currentPassword) {
        throwMissingDataError('Old password')
    }
    if (!newPassword) {
        throwMissingDataError('New password')
    }
    if (currentPassword === newPassword) {
        throwSameCurrentPasswordNewPasswordError()
    }
}

export const validateUpdateUserProfile = (req) => {
    const { userId } = req.params
    validateUserIdHelper(userId)
    const allowedFields = ['firstName', 'lastName', 'dob', 'gender', 'mobile', 'photoUrl', 'about', 'skills']
    const isRequestValid = Object.keys(req.body).every((key) => allowedFields.includes(key))
    if (!isRequestValid) {
        throwInvalidUserProfileUpdateError()
    }
    return isRequestValid
}
