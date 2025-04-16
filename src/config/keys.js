module.exports = {
    EXPRESS_PORT: process.env.EXPRESS_PORT,
    FRONTEND_DEV_URL: process.env.FRONTEND_DEV_URL,
    REQUEST_STATUS: {
        SUCCESS: {
            statusCode: 200,
            success: true,
        },
        BAD_REQUEST: {
            statusCode: 400,
            success: false,
        },
        UNAUTHORIZED: {
            statusCode: 401,
            success: false,
        },
        FORBIDDEN: {
            statusCode: 403,
            success: false,
        },
        NOT_FOUND: {
            statusCode: 404,
            success: false,
        },
        SERVER_ERROR: {
            statusCode: 500,
            success: false,
        },
    },
    USER: {
        PASSWORD_SALT_ROUNDS: 10,
        CUSTOMER_FIELDS: ['firstName', 'lastName', 'photoUrl', 'age', 'gender', 'about', 'skills'],
        ADMIN_FIELDS: ['firstName', 'lastName', 'photoUrl', 'age', 'gender', 'about', 'skills', 'email'],
    },
}
