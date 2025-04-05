const validator = require('validator');
const { throwInvalidDataError, throwMissingDataError, throwUserSkillCountError } = require('../utils/errorUtils');

const validateUserSignIn = (req) => {
    const { email, password } = req.body;
    if (!email) {
        throwMissingDataError('email');
    }
    if (!validator.isEmail(email)) {
        throwInvalidDataError('email', email);
    }
    if (!password) {
        throwMissingDataError('password');
    }
};

const validateUserSignUp = (req) => {
    const { firstName, lastName, email, password, skills, photoUrl, dob, gender, mobile, about } = req.body;
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
        throwInvalidDataError('email', email);
    }
    if (skills && skills.length > 5) {
        throwUserSkillCountError();
    }
    if (photoUrl && !validator.isURL(photoUrl)) {
        throwInvalidDataError('photoUrl', photoUrl);
    }
    if (dob && !validator.isDate(dob)) {
        throwInvalidDataError('dob', dob);
    }
    if (gender && !['male', 'female', 'other'].includes(gender)) {
        throwInvalidDataError('gender', gender);
    }
    if (mobile && mobile.length < 10) {
        throwInvalidDataError('mobile', mobile);
    }
    if (about && about.length >= 300) {
        throwInvalidDataError('about', about);
    }
};

module.exports = {
    validateUserSignIn,
    validateUserSignUp,
};
