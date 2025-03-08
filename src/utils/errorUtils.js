const { STATUS_CODES } = require('../config/keys');

const throwMissingDataError = (missingFieldName) => {
    throw new Error(`API validation error. ${missingFieldName} missing`, {
        cause: { statusCode: STATUS_CODES.BAD_REQUEST },
    });
};

const throwInvalidDataError = (invalidFieldName) => {
    throw new Error(`API validation error. Invalid ${invalidFieldName}.`, {
        cause: { statusCode: STATUS_CODES.BAD_REQUEST },
    });
};

module.exports = {
    throwMissingDataError,
    throwInvalidDataError,
};
