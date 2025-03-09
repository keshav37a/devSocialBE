const { hash } = require('bcrypt');
const { STATUS_CODES, USER } = require('../config/keys');
const { UserModel } = require('../models/userModel');
const {
    validateUserSignIn,
    validateUserSignUp,
    validateGetUserById,
    validateDeleteUserByEmail,
    validateDeleteUserById,
    validateUpdateUser,
    validateGetUserProfile,
    validateUpdateUserProfile,
} = require('../validation/userValidation');
const {
    throwUserNotFoundError,
    throwEmailAlreadyInUseError,
    throwIncorrectPasswordError,
} = require('../utils/errorUtils');

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

const getUserProfile = async (req, res) => {
    try {
        validateGetUserProfile(req);
        const userId = req.body.userId;
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

const signUpNewUser = async (req, res) => {
    try {
        validateUserSignUp(req);
        const { firstName, lastName, email, password, dob, gender, type, mobile, photoUrl, about, skills } = req.body;
        const existingUser = await UserModel.findOne({ email });

        if (existingUser) {
            throwEmailAlreadyInUseError();
        }

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

const signInUser = async (req, res) => {
    try {
        validateUserSignIn(req);
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });
        if (!user) {
            throwUserNotFoundError('email');
        }

        const isPasswordMatch = await user.validatePassword(password);
        if (!isPasswordMatch) {
            throwIncorrectPasswordError();
        }

        const token = await user.getJWT();
        user.password = null;
        res.cookie('token', token);
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
    deleteUserByEmail,
    deleteUserById,
    getAllUsers,
    getUserById,
    getUserProfile,
    signInUser,
    signUpNewUser,
    updateUser,
    updateUserProfile,
};
