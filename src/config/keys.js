module.exports = {
    DATABASE_NAME: process.env.DATABASE_NAME,
    EXPRESS_PORT: process.env.EXPRESS_PORT,
    CONNECTION_URI: process.env.CONNECTION_URI,
    STATUS_CODES: {
        SUCCESS: 200,
        SERVER_ERROR: 500,
        BAD_REQUEST: 400,
        NOT_FOUND: 404,
    },
};
