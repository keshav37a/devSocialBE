module.exports = {
    CONNECTION_URI: process.env.CONNECTION_URI,
    DATABASE_NAME: process.env.DATABASE_NAME,
    EXPRESS_PORT: process.env.EXPRESS_PORT,
    JWT_TOKEN_SECRET_KEY: process.env.JWT_TOKEN_SECRET_KEY,
    STATUS_CODES: {
        SUCCESS: 200,
        BAD_REQUEST: 400,
        UNAUTHORIZED: 401,
        FORBIDDEN: 403,
        NOT_FOUND: 404,
        SERVER_ERROR: 500,
    },
    USER: {
        PASSWORD_SALT_ROUNDS: 10,
    },
};
