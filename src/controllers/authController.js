const { hash } = require('bcrypt');

const { UserModel } = require('../models/userModel');

const {
    throwEmailAlreadyInUseError,
    throwIncorrectPasswordError,
    throwUserNotFoundError,
} = require('../utils/errorUtils');
const { sendStandardResponse } = require('../utils/responseUtils');

const { validateUserSignIn, validateUserSignUp } = require('../validation/userValidation');

const { USER } = require('../config/keys');

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
        sendStandardResponse(res, { message: 'User authenticated', data: { user } });
    } catch (error) {
        sendStandardResponse(res, { message: error.message, data: { user: null }, error });
    }
};

const signOutUser = async (_, res) => {
    try {
        res.cookie('token', null, {
            expires: new Date(Date.now()),
        });
        sendStandardResponse(res, { message: 'User signed out successfully', data: { user: null } });
    } catch (error) {
        sendStandardResponse(res, { message: error.message, data: { user: null }, error });
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
        sendStandardResponse(res, { message: 'User created successfully', data: { user: newSavedUser } });
    } catch (error) {
        sendStandardResponse(res, { message: error.message, data: { user: null }, error });
    }
};

module.exports = {
    signInUser,
    signOutUser,
    signUpNewUser,
};
