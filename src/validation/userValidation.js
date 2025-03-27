const mongoose = require('mongoose');
const validator = require('validator');

const {
    throwInvalidDataError,
    throwInvalidUserProfileUpdateError,
    throwMissingDataError,
} = require('../utils/errorUtils');

const { STATUS_CODES } = require('../config/keys');

const _validateUserIdHelper = (userId) => {
    if (!userId) {
        throwMissingDataError('userId');
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throwInvalidDataError('userId');
    }
};

const _validateUserFieldsHelper = async (userData) => {
    const { firstName, lastName, email, password, skills, photoUrl, dob, gender, mobile, about } = userData;
    if (!firstName) {
        throwMissingDataError('firstName');
    }
    if (!lastName) {
        throwMissingDataError('lastName');
    }
    if (!email) {
        throwMissingDataError('email');
    }
    if (!password) {
        throwMissingDataError('password');
    }

    if (!validator.isEmail(email)) {
        throwInvalidDataError('email');
    }
    if (skills && skills.length > 5) {
        throw new Error(`API validation error. skills can't be more than 5`, {
            cause: { statusCode: STATUS_CODES.BAD_REQUEST },
        });
    }
    if (photoUrl && !validator.isURL(photoUrl)) {
        throwInvalidDataError('photoUrl');
    }
    if (dob && !validator.isDate(dob)) {
        throwInvalidDataError('dob');
    }
    if (gender && !['male', 'female', 'other'].includes()) {
        throwInvalidDataError('gender');
    }
    if (mobile && mobile.length < 10) {
        throwInvalidDataError('mobile');
    }
    if (about && about.length >= 300) {
        throwInvalidDataError('about');
    }
};

const validateDeleteUserByEmail = (req) => {
    const email = req.body.email;
    if (!email) {
        throwMissingDataError('email');
    }
};

const validateDeleteUserById = (req) => {
    const userId = req.params.userId;
    _validateUserIdHelper(userId);
};

const validateGetUserById = (req) => {
    const userId = req.params.userId;
    _validateUserIdHelper(userId);
};

const validateGetUserProfile = (req) => {
    const userId = req.params.userId;
    _validateUserIdHelper(userId);
};

const validateUpdateUser = (req) => {
    const userId = req.params.userId;
    _validateUserIdHelper(userId);
};

const validateUpdateUserProfile = (req) => {
    const userId = req.params.userId;
    _validateUserIdHelper(userId);
    const allowedFields = ['firstName', 'lastName', 'dob', 'gender', 'mobile', 'photoUrl', 'about', 'skills'];
    const isRequestValid = Object.keys(req.body).every((key) => allowedFields.includes(key));
    if (!isRequestValid) {
        throwInvalidUserProfileUpdateError();
    }
    return isRequestValid;
};

const validateUserSignUp = (req) => {
    const userData = req.body;
    _validateUserFieldsHelper(userData);
};

const validateUserSignIn = (req) => {
    const { email, password } = req.body;
    if (!email) {
        throwMissingDataError('email');
    }
    if (!validator.isEmail(email)) {
        throwInvalidDataError('email');
    }
    if (!password) {
        throwMissingDataError('password');
    }
};

module.exports = {
    validateDeleteUserByEmail,
    validateDeleteUserById,
    validateGetUserById,
    validateGetUserProfile,
    validateUpdateUser,
    validateUpdateUserProfile,
    validateUserSignUp,
    validateUserSignIn,
};
