export const PORT_PROD = process.env.PORT_PROD
export const PORT_DEV = process.env.PORT_DEV
export const FRONTEND_DEV_URL = process.env.FRONTEND_DEV_URL
export const FRONTEND_PROD_URL = process.env.FRONTEND_PROD_URL
export const REQUEST_STATUS = {
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
}
export const USER = {
    PASSWORD_SALT_ROUNDS: 10,
    CUSTOMER_FIELDS: ['firstName', 'lastName', 'photoUrl', 'dob', 'gender', 'about', 'skills', 'email', 'fullName'],
    ADMIN_FIELDS: [
        'firstName',
        'lastName',
        'photoUrl',
        'dob',
        'gender',
        'about',
        'skills',
        'email',
        'type',
        'fullName',
    ],
}
export const DEFAULT_USER_DP =
    'https://res.cloudinary.com/dqiewourk/image/upload/v1749020573/default-user-dp_y3asgd.png'
