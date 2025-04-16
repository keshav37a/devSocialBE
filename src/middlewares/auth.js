const jwt = require('jsonwebtoken')

const { UserModel } = require('#Models/userModel')

const {
    throwUserNotFoundError,
    throwTokenNotFoundError,
    throwInvalidTokenError,
    throwUserForbiddenError,
} = require('#Utils/errorUtils')
const { sendStandardResponse } = require('#Utils/responseUtils')

const adminAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies
        if (!token) {
            throwTokenNotFoundError()
        }
        const { _id: userId } = await jwt.verify(token, process.env.JWT_TOKEN_SECRET_KEY)
        if (!userId) {
            throwInvalidTokenError()
        }

        const user = await UserModel.findById(userId)
        if (!user) {
            throwUserNotFoundError('userId', userId)
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

const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies
        if (!token) {
            throwTokenNotFoundError()
        }
        const { _id: userId } = await jwt.verify(token, process.env.JWT_TOKEN_SECRET_KEY)
        if (!userId) {
            throwInvalidTokenError()
        }

        const user = await UserModel.findById(userId)
        if (!user) {
            throwUserNotFoundError('userId', userId)
        }
        req.user = user
        next()
    } catch (error) {
        sendStandardResponse(res, { message: error.message, error })
    }
}

module.exports = {
    adminAuth,
    userAuth,
}
