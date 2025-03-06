const mongoose = require('mongoose');
const { STATUS_CODES } = require('../config/keys');

const validateUserIdHelper = (userId) => {
    if (!userId) {
        throw new Error('API validation error. userId missing', {
            cause: { statusCode: STATUS_CODES.BAD_REQUEST },
        });
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('API validation error. Invalid userId', {
            cause: { statusCode: STATUS_CODES.BAD_REQUEST },
        });
    }
};

const validateUserFieldsHelper = (userData) => {
    const { firstName, lastName, email, password, skills, photoUrl, dob, gender, mobile, about } = userData;
    if (!firstName) {
        throw new Error('API validation error. First Name missing', {
            cause: { statusCode: STATUS_CODES.BAD_REQUEST },
        });
    }
    if (!lastName) {
        throw new Error('API validation error. Last Name missing', {
            cause: { statusCode: STATUS_CODES.BAD_REQUEST },
        });
    }
    if (!email) {
        throw new Error('API validation error. Email missing', { cause: { statusCode: STATUS_CODES.BAD_REQUEST } });
    }
    if (!validator.isEmail(email)) {
        throw new Error('API validation error. Invalid email', { cause: { statusCode: STATUS_CODES.BAD_REQUEST } });
    }
    if (!password) {
        throw new Error('API validation error. Password missing', { cause: { statusCode: STATUS_CODES.BAD_REQUEST } });
    }
    if (skills && skills.length > 5) {
        throw new Error('API validation error. Password missing', { cause: { statusCode: STATUS_CODES.BAD_REQUEST } });
    }
    if (photoUrl && !validator.isURL(photoUrl)) {
        throw new Error('API validation error. Invalid photoUrl', { cause: { statusCode: STATUS_CODES.BAD_REQUEST } });
    }
    if (dob && !validator.isDate(dob)) {
        throw new Error('API validation error. Invalid dob', { cause: { statusCode: STATUS_CODES.BAD_REQUEST } });
    }
    if (gender && !['male', 'female', 'other'].includes()) {
        throw new Error('API validation error. Invalid gender', { cause: { statusCode: STATUS_CODES.BAD_REQUEST } });
    }
    if (mobile && mobile.length < 10) {
        throw new Error('API validation error. Invalid mobile', { cause: { statusCode: STATUS_CODES.BAD_REQUEST } });
    }
    if (about && about.length >= 300) {
        throw new Error('API validation error. Invalid about', { cause: { statusCode: STATUS_CODES.BAD_REQUEST } });
    }
};

const validateGetUserById = (req) => {
    const userId = req.params.userId;
    validateUserIdHelper(userId);
};

const validateSignUpData = (req) => {
    const userData = req.body;
    validateUserFieldsHelper(userData);
};

const validateDeleteUserByEmail = (req) => {
    const email = req.body.email;
    if (!email) {
        throw new Error('API validation error. Email missing in body', {
            cause: { statusCode: STATUS_CODES.BAD_REQUEST },
        });
    }
};

const validateDeleteUserById = (req) => {
    const userId = req.params.userId;
    validateUserIdHelper(userId);
};

const validateUpdateUser = (req) => {
    const userId = req.params.userId;
    validateUserIdHelper(userId);
};

module.exports = {
    validateGetUserById,
    validateSignUpData,
    validateDeleteUserByEmail,
    validateDeleteUserById,
    validateUpdateUser,
};
