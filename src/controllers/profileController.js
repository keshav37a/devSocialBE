const { UserModel } = require('../models/userModel');

const { throwUserNotFoundError } = require('../utils/errorUtils');
const { validateGetUserProfile, validateUpdateUserProfile } = require('../validation/userValidation');

const { STATUS_CODES } = require('../config/keys');

const getUserProfile = async (req, res) => {
    try {
        validateGetUserProfile(req);
        const userId = req.params.userId;
        const user = await UserModel.findById(userId);
        if (!user) {
            throwUserNotFoundError('userId');
        }
        return res.status(STATUS_CODES.SUCCESS).send({
            user,
            statusCode: STATUS_CODES.SUCCESS,
        });
    } catch (err) {
        const statusCode = err.cause?.statusCode ? err.cause.statusCode : STATUS_CODES.SERVER_ERROR;
        return res.status(statusCode).send({
            message: err.message,
            errorCode: err.errorResponse?.code,
            statusCode,
        });
    }
};

const updateUserProfile = async (req, res) => {
    try {
        validateUpdateUserProfile(req);
        const { userId, firstName, lastName, dob, gender, mobile, photoUrl, about, skills } = req.body;

        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { firstName, lastName, dob, gender, mobile, photoUrl, about, skills },
            { new: true }
        );
        if (!updatedUser) {
            throwUserNotFoundError('userId');
        }
        return res.status(STATUS_CODES.SUCCESS).send({
            message: 'user updated successfully',
            user: updatedUser,
            statusCode: STATUS_CODES.SUCCESS,
        });
    } catch (err) {
        return res.status(STATUS_CODES.SERVER_ERROR).send({
            message: err?.message,
            errorCode: err?.errorResponse?.code,
            statusCode: STATUS_CODES.SERVER_ERROR,
        });
    }
};

module.exports = {
    getUserProfile,
    updateUserProfile,
};
