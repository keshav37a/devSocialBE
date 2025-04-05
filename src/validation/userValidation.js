const mongoose = require('mongoose');

const { throwInvalidDataError, throwMissingDataError } = require('../utils/errorUtils');

const validateDeleteUserByEmail = (req) => {
    const { email } = req.body;
    if (!email) {
        throwMissingDataError('email');
    }
};

const validateDeleteUserById = (req) => {
    const { userId } = req.params;
    validateUserIdHelper(userId);
};

const validateGetUserById = (req) => {
    const { userId } = req.params;
    validateUserIdHelper(userId);
};

const validateUpdateUser = (req) => {
    const { userId } = req.params;
    validateUserIdHelper(userId);
};

const validateUserIdHelper = (userId) => {
    if (!userId) {
        throwMissingDataError('userId');
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throwInvalidDataError('userId', userId);
    }
};

module.exports = {
    validateDeleteUserByEmail,
    validateDeleteUserById,
    validateGetUserById,
    validateUpdateUser,
    validateUserIdHelper,
};
