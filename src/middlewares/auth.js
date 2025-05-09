import jwt from 'jsonwebtoken'

import { UserModel } from '#Models/userModel'

import { USER } from '#Config/keys'
import {
    throwInvalidTokenError,
    throwTokenNotFoundError,
    throwUserForbiddenError,
    throwUserNotFoundError,
} from '#Utils/errorUtils'
import { sendStandardResponse } from '#Utils/responseUtils'

export const adminAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies
        if (!token) {
            throwTokenNotFoundError()
        }
        const { _id: userId } = await jwt.verify(token, process.env.JWT_TOKEN_SECRET_KEY)
        if (!userId) {
            throwInvalidTokenError()
        }

        const user = await UserModel.findById(userId).select(USER.ADMIN_FIELDS)
        if (!user) {
            throwUserNotFoundError()
        }
        if (user.type !== 'admin') {
            throwUserForbiddenError()
        }
        req.user = user
        next()
    } catch (error) {
        sendStandardResponse(res, { message: error.message, error })
    }
}

export const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies
        if (!token) {
            throwTokenNotFoundError()
        }
        const { _id: userId } = await jwt.verify(token, process.env.JWT_TOKEN_SECRET_KEY)
        if (!userId) {
            throwInvalidTokenError()
        }

        const user = await UserModel.findById(userId).select(USER.CUSTOMER_FIELDS)
        if (!user) {
            throwUserNotFoundError()
        }
        req.user = user
        next()
    } catch (error) {
        sendStandardResponse(res, { message: error.message, error })
    }
}
