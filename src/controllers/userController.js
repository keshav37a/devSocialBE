const { hash, compare } = require('bcrypt');
const { STATUS_CODES, USER } = require('../config/keys');
const { UserModel } = require('../models/userModel');
const {
    validateUserSignIn,
    validateUserSignUp,
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
            throw new Error('API validation error. User not found. userId not present in DB', {
                cause: { statusCode: STATUS_CODES.NOT_FOUND },
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

const deleteUserByEmail = async (req, res) => {
    try {
        validateDeleteUserByEmail(req);
        const { email } = req.body;
        const deletedUser = await UserModel.findOneAndDelete({ email });
        if (!deletedUser) {
            throw new Error('API validation error. User not found. email not present in DB', {
                cause: { statusCode: STATUS_CODES.NOT_FOUND },
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
        if (!deletedUser) {
            throw new Error('API validation error. User not found. userId not present in DB', {
                cause: { statusCode: STATUS_CODES.NOT_FOUND },
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

const signUpNewUser = async (req, res) => {
    try {
        validateUserSignUp(req);
        const { firstName, lastName, email, password, dob, gender, type, mobile, photoUrl, about, skills } = req.body;
        const passwordHash = await hash(password, USER.PASSWORD_SALT_ROUNDS);
        const newUser = UserModel({
            firstName,
            lastName,
            email,
            password: passwordHash,
            dob,
            gender,
            type,
            mobile,
            photoUrl,
            about,
            skills,
        });
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

const signIn = async (req, res) => {
    try {
        validateUserSignIn(req);
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });
        if (!user) {
            throw new Error('API validation error. User not found. email not present in DB', {
                cause: { statusCode: STATUS_CODES.NOT_FOUND },
            });
        }

        const isPasswordMatch = await compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(STATUS_CODES.BAD_REQUEST).send({
                message: 'Incorrect password',
                statusCode: STATUS_CODES.BAD_REQUEST,
            });
        }
        user.password = null;
        return res.status(STATUS_CODES.SUCCESS).send({
            message: 'User authenticated',
            statusCode: STATUS_CODES.SUCCESS,
            user,
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
    deleteUserByEmail,
    deleteUserById,
    getAllUsers,
    getUserById,
    signIn,
    signUpNewUser,
    updateUser,
};
