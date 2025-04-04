const { REQUEST_STATUS } = require('../config/keys');

const throwEmailAlreadyInUseError = () => {
    throw new Error(`API validation error. email already in use`, {
        cause: REQUEST_STATUS.BAD_REQUEST,
    });
};

const throwIncorrectPasswordError = () => {
    throw new Error('API validation error. Incorrect password', {
        cause: REQUEST_STATUS.BAD_REQUEST,
    });
};

const throwInvalidDataError = (invalidFieldName) => {
    throw new Error(`API validation error. Invalid ${invalidFieldName}.`, {
        cause: REQUEST_STATUS.BAD_REQUEST,
    });
};

const throwInvalidTokenError = () => {
    throw new Error('API validation error. Invalid token. Unauthorized', {
        cause: REQUEST_STATUS.UNAUTHORIZED,
    });
};

const throwInvalidUserProfileUpdateError = () => {
    throw new Error('Invalid profile update request. Some fields are not editable', {
        cause: REQUEST_STATUS.BAD_REQUEST,
    });
};

const throwMissingDataError = (missingFieldName) => {
    throw new Error(`API validation error. ${missingFieldName} missing`, {
        cause: REQUEST_STATUS.BAD_REQUEST,
    });
};

const throwSameCurrentPasswordNewPasswordError = () => {
    throw new Error(`API validation error. New password can't be same as current password.`, {
        cause: REQUEST_STATUS.BAD_REQUEST,
    });
};

const throwTokenNotFoundError = () => {
    throw new Error('API validation error. Token not found. Unauthorized', {
        cause: REQUEST_STATUS.UNAUTHORIZED,
    });
};

const throwUserForbiddenError = () => {
    throw new Error('API validation error. User is forbidden.', {
        cause: REQUEST_STATUS.FORBIDDEN,
    });
};

const throwUserNotFoundError = (fieldNotFoundName) => {
    throw new Error(`API validation error. User not found. ${fieldNotFoundName} not present in DB`, {
        cause: REQUEST_STATUS.NOT_FOUND,
    });
};

module.exports = {
    throwEmailAlreadyInUseError,
    throwIncorrectPasswordError,
    throwInvalidDataError,
    throwInvalidTokenError,
    throwInvalidUserProfileUpdateError,
    throwMissingDataError,
    throwSameCurrentPasswordNewPasswordError,
    throwTokenNotFoundError,
    throwUserForbiddenError,
    throwUserNotFoundError,
};
