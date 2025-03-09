const jwt = require('jsonwebtoken');
const { UserModel } = require('../models/userModel');
const {
    throwUserNotFoundError,
    throwTokenNotFoundError,
    throwInvalidTokenError,
    throwUserForbiddenError,
} = require('../utils/errorUtils');
const { STATUS_CODES, JWT_TOKEN_SECRET_KEY } = require('../config/keys');

const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            throwTokenNotFoundError();
        }
        const { _id: userId } = await jwt.verify(token, JWT_TOKEN_SECRET_KEY);
        if (!userId) {
            throwInvalidTokenError();
        }

        const user = await UserModel.findById(userId);
        if (!user) {
            throwUserNotFoundError('userId');
        }
        req.user = user;
        next();
    } catch (err) {
        const statusCode = err.cause?.statusCode ? err.cause.statusCode : STATUS_CODES.SERVER_ERROR;
        return res.status(statusCode).send({
            message: err.message,
            errorCode: err.errorResponse?.code,
            statusCode,
        });
    }
};

const adminAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            throwTokenNotFoundError();
        }
        const { _id: userId } = await jwt.verify(token, JWT_TOKEN_SECRET_KEY);
        if (!userId) {
            throwInvalidTokenError();
        }

        const user = await UserModel.findById(userId);
        if (!user) {
            throwUserNotFoundError('userId');
        }
        if (user.type !== 'admin') {
            throwUserForbiddenError();
        }
        req.user = user;
        next();
    } catch (err) {
        const statusCode = err.cause?.statusCode ? err.cause.statusCode : STATUS_CODES.SERVER_ERROR;
        return res.status(statusCode).send({
            message: err.message,
            errorCode: err.errorResponse?.code,
            statusCode,
        });
    }
};

module.exports = {
    userAuth,
    adminAuth,
};
