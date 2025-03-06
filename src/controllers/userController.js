const { STATUS_CODES } = require('../config/keys');
const { UserModel } = require('../models/userModel');
const {
    validateSignUpData,
    validateGetUserById,
    validateDeleteUserByEmail,
    validateDeleteUserById,
    validateUpdateUser,
} = require('../validation/userValidation');

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
            return res.status(STATUS_CODES.NOT_FOUND).send({
                user,
                message: 'User not found',
                statusCode: STATUS_CODES.NOT_FOUND,
            });
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

const signUpNewUser = async (req, res) => {
    try {
        validateSignUpData(req);
        const newUser = UserModel(req.body);
        const newSavedUser = await newUser.save();
        return res.status(STATUS_CODES.SUCCESS).send({
            _id: newSavedUser._id,
            message: 'User created successfully',
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

const deleteUserByEmail = async (req, res) => {
    try {
        validateDeleteUserByEmail(req);
        const { email } = req.body;
        const deletedUser = await UserModel.findOneAndDelete({ email });
        if (!deletedUser) {
            return res.status(STATUS_CODES.NOT_FOUND).send({
                _id: deletedUser?._id,
                message: 'User not found',
                statusCode: STATUS_CODES.NOT_FOUND,
            });
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

const updateUser = async (req, res) => {
    try {
        validateUpdateUser(req);
        const userId = req.body.userId;
        const updatedUser = await UserModel.findByIdAndUpdate(userId, req.body, { new: true });
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
    getAllUsers,
    getUserById,
    signUpNewUser,
    deleteUserByEmail,
    deleteUserById,
    updateUser,
};
