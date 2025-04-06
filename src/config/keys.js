module.exports = {
    CONNECTION_URI: process.env.CONNECTION_URI,
    DATABASE_NAME: process.env.DATABASE_NAME,
    EXPRESS_PORT: process.env.EXPRESS_PORT,
    JWT_TOKEN_SECRET_KEY: process.env.JWT_TOKEN_SECRET_KEY,
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
};
