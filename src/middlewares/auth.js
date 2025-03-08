const jwt = require('jsonwebtoken');
const { UserModel } = require('../models/userModel');
const { STATUS_CODES, JWT_TOKEN_SECRET_KEY } = require('../config/keys');

const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            throw new Error('API validation error. Token not found. Unauthorized', {
                cause: { statusCode: STATUS_CODES.UNAUTHORIZED },
            });
        }
        const { _id: userId } = await jwt.verify(token, JWT_TOKEN_SECRET_KEY);
        if (!userId) {
            throw new Error('API validation error. Invalid token. Unauthorized', {
                cause: { statusCode: STATUS_CODES.UNAUTHORIZED },
            });
        }

        const user = await UserModel.findById(userId);
        if (!user) {
            throw new Error('API validation error. User not found. userId not present in DB', {
                cause: { statusCode: STATUS_CODES.NOT_FOUND },
            });
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
};
