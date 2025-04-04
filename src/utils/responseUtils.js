const { REQUEST_STATUS } = require('../config/keys');

const sendStandardResponse = (res, { status, message, data, error }) => {
    if (error) {
        status = error?.cause ? error?.cause : REQUEST_STATUS.SERVER_ERROR;
    } else {
        error = null;
    }
    if (!status) {
        status = REQUEST_STATUS.SUCCESS;
    }
    if (!message) {
        message = null;
    }
    if (!data) {
        data = null;
    }
    res.status(status.statusCode).json({
        status,
        message,
        data,
        error,
    });
};

module.exports = {
    sendStandardResponse,
};
