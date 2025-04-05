const {
    throwInvalidUserProfileUpdateError,
    throwMissingDataError,
    throwSameCurrentPasswordNewPasswordError,
    throwUserForbiddenError,
} = require('../utils/errorUtils');
const { validateUserIdHelper } = require('./userValidation');

const validateChangePasswordAsSignedInUser = (req) => {
    const currentPassword = req.body.currentPassword;
    const newPassword = req.body.newPassword;
    const user = req.user;

    if (!user) {
        throwUserForbiddenError();
    }

    if (!currentPassword) {
        throwMissingDataError('Old password');
    }

    if (!newPassword) {
        throwMissingDataError('New password');
    }

    if (currentPassword === newPassword) {
        throwSameCurrentPasswordNewPasswordError();
    }
};

const validateUpdateUserProfile = (req) => {
    const userId = req.params.userId;
    validateUserIdHelper(userId);
    const allowedFields = ['firstName', 'lastName', 'dob', 'gender', 'mobile', 'photoUrl', 'about', 'skills'];
    const isRequestValid = Object.keys(req.body).every((key) => allowedFields.includes(key));
    if (!isRequestValid) {
        throwInvalidUserProfileUpdateError();
    }
    return isRequestValid;
};

module.exports = {
    validateChangePasswordAsSignedInUser,
    validateUpdateUserProfile,
};
