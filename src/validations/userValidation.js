import mongoose from 'mongoose'

import { throwInvalidDataError, throwMissingDataError, throwUserForbiddenError } from '#Utils/errorUtils'

export const validateDeleteUserByEmail = (req) => {
    const { email } = req.body
    if (!email) {
        throwMissingDataError('email')
    }
}

export const validateDeleteUserById = (req) => {
    const { userId } = req.params
    validateIsUserSignedIn(req)
    validateUserIdHelper(userId)
}

export const validateGetUserById = (req) => {
    const { userId } = req.params
    validateIsUserSignedIn(req)
    validateUserIdHelper(userId)
}

export const validateIsUserSignedIn = (req) => {
    const user = req.user
    if (!user) {
        throwUserForbiddenError()
    }
}

export const validateUpdateUser = (req) => {
    const { userId } = req.params
    validateUserIdHelper(userId)
}

export const validateUserIdHelper = (userId) => {
    if (!userId) {
        throwMissingDataError('userId')
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throwInvalidDataError('userId', userId)
    }
}
