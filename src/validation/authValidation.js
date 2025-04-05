const validator = require('validator');
const { throwInvalidDataError, throwMissingDataError, throwUserSkillCountError } = require('../utils/errorUtils');

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
        throwInvalidDataError('email');
    }
    if (skills && skills.length > 5) {
        throwUserSkillCountError();
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

module.exports = {
    validateUserSignIn,
    validateUserSignUp,
};
