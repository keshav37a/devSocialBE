const { STATUS_CODES } = require('../config/keys');

const throwEmailAlreadyInUseError = () => {
    throw new Error(`API validation error. email already in use`, {
        cause: { statusCode: STATUS_CODES.BAD_REQUEST },
    });
};

const throwIncorrectPasswordError = () => {
    throw new Error('API validation error. Incorrect password', {
        cause: { statusCode: STATUS_CODES.BAD_REQUEST },
    });
};

const throwInvalidDataError = (invalidFieldName) => {
    throw new Error(`API validation error. Invalid ${invalidFieldName}.`, {
        cause: { statusCode: STATUS_CODES.BAD_REQUEST },
    });
};

const throwInvalidTokenError = () => {
    throw new Error('API validation error. Invalid token. Unauthorized', {
        cause: { statusCode: STATUS_CODES.UNAUTHORIZED },
    });
};

const throwInvalidUserProfileUpdateError = () => {
    throw new Error('Invalid profile update request. Some fields are not editable', {
        cause: { statusCode: STATUS_CODES.BAD_REQUEST },
    });
};

const throwMissingDataError = (missingFieldName) => {
    throw new Error(`API validation error. ${missingFieldName} missing`, {
        cause: { statusCode: STATUS_CODES.BAD_REQUEST },
    });
};

const throwTokenNotFoundError = () => {
    throw new Error('API validation error. Token not found. Unauthorized', {
        cause: { statusCode: STATUS_CODES.UNAUTHORIZED },
    });
};

const throwUserForbiddenError = () => {
    throw new Error('API validation error. User is forbidden.', {
        cause: { statusCode: STATUS_CODES.FORBIDDEN },
    });
};

const throwUserNotFoundError = (fieldNotFoundName) => {
    throw new Error(`API validation error. User not found. ${fieldNotFoundName} not present in DB`, {
        cause: { statusCode: STATUS_CODES.NOT_FOUND },
    });
};

module.exports = {
    throwEmailAlreadyInUseError,
    throwIncorrectPasswordError,
    throwInvalidDataError,
    throwInvalidTokenError,
    throwInvalidUserProfileUpdateError,
    throwMissingDataError,
    throwTokenNotFoundError,
    throwUserForbiddenError,
    throwUserNotFoundError,
};
