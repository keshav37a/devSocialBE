const { UserModel } = require('../models/userModel');

const { throwUserNotFoundError } = require('../utils/errorUtils');
const {
    validateDeleteUserByEmail,
    validateDeleteUserById,
    validateGetUserById,
    validateUpdateUser,
} = require('../validation/userValidation');

const { STATUS_CODES } = require('../config/keys');

const deleteUserByEmail = async (req, res) => {
    try {
        validateDeleteUserByEmail(req);
        const { email } = req.body;
        const deletedUser = await UserModel.findOneAndDelete({ email });
        if (!deletedUser) {
            throwUserNotFoundError('email');
        }
        return res.status(STATUS_CODES.SUCCESS).send({
            _id: deletedUser._id,
            message: 'User deleted successfully',
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

const deleteUserById = async (req, res) => {
    try {
        validateDeleteUserById(req);
        const userId = req.params.userId;
        const deletedUser = await UserModel.findByIdAndDelete(userId);
        if (!deletedUser) {
            throwUserNotFoundError('userId');
        }
        return res.status(STATUS_CODES.SUCCESS).send({
            _id: deletedUser._id,
            message: 'User deleted successfully',
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

const getAllUsers = async (_, res) => {
    try {
        const users = await UserModel.find();
        return res.status(STATUS_CODES.SUCCESS).send({
            users,
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

const getUserById = async (req, res) => {
    try {
        validateGetUserById(req);
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

const updateUser = async (req, res) => {
    try {
        validateUpdateUser(req);
        const userId = req.params.userId;
        const { firstName, lastName, email, dob, gender, type, mobile, photoUrl, about, skills } = req.body;
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { firstName, lastName, email, dob, gender, type, mobile, photoUrl, about, skills },
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
    deleteUserByEmail,
    deleteUserById,
    getAllUsers,
    getUserById,
    updateUser,
};
