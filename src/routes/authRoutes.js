const express = require('express');

const { signInUser, signUpNewUser } = require('../controllers/authController');

const router = express.Router();

/* Customer routes */
router.post('/signin', signInUser);
router.post('/signup', signUpNewUser);

module.exports = {
    authRoutes: router,
};
