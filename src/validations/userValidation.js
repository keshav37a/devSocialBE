import mongoose from 'mongoose'

import { USER } from '#Config/keys'

import {
    throwFieldShouldBeAnArrayError,
    throwInvalidDataError,
    throwInvalidUserProfileUpdateError,
    throwMissingDataError,
    throwUserForbiddenError,
} from '#Utils/errorUtils'

export const validateBulkUpdateUsers = (req) => {
    const { all, userIds, ...restFields } = req.body
    if (!all && !userIds) {
        throwMissingDataError('userId')
    }
    if (userIds && !Array.isArray(userIds)) {
        throwFieldShouldBeAnArrayError('userIds')
    }
    if (userIds && userIds.length > 0) {
        userIds.forEach((userId) => validateUserIdHelper(userId))
    }

    const isRequestValid = Object.keys(restFields).every((key) => USER.CUSTOMER_FIELDS.includes(key))
    if (!isRequestValid) {
        throwInvalidUserProfileUpdateError()
    }
}

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
