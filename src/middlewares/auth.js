const jwt = require('jsonwebtoken');

const { UserModel } = require('../models/userModel');

const {
    throwUserNotFoundError,
    throwTokenNotFoundError,
    throwInvalidTokenError,
    throwUserForbiddenError,
} = require('../utils/errorUtils');
const { sendStandardResponse } = require('../utils/responseUtils');

const { JWT_TOKEN_SECRET_KEY } = require('../config/keys');

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
            throwUserNotFoundError('userId', userId);
        }
        if (user.type !== 'admin') {
            throwUserForbiddenError();
        }
        req.user = user;
        next();
    } catch (error) {
        sendStandardResponse(res, { message: error.message, error });
    }
};

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
            throwUserNotFoundError('userId', userId);
        }
        req.user = user;
        next();
    } catch (error) {
        sendStandardResponse(res, { message: error.message, error });
    }
};

module.exports = {
    adminAuth,
    userAuth,
};
