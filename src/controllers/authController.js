const { hash } = require('bcrypt');

const { UserModel } = require('../models/userModel');

const {
    throwUserNotFoundError,
    throwEmailAlreadyInUseError,
    throwIncorrectPasswordError,
} = require('../utils/errorUtils');
const { validateUserSignIn, validateUserSignUp } = require('../validation/userValidation');

const { USER, STATUS_CODES } = require('../config/keys');

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

const signOutUser = async (_, res) => {
    try {
        res.cookie('token', null, {
            expires: new Date(Date.now()),
        })
            .status(STATUS_CODES.SUCCESS)
            .send({
                message: 'User signed out successfully',
                errorCode: null,
                user: null,
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

module.exports = {
    signInUser,
    signOutUser,
    signUpNewUser,
};
