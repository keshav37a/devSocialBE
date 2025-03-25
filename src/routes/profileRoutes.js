const express = require('express');

const { getUserProfile, updateUserProfile } = require('../controllers/profileController');
const { userAuth } = require('../middlewares/auth');

const router = express.Router();

/* Customer routes */
router.patch('/edit', userAuth, updateUserProfile);
router.get('/view/:userId', userAuth, getUserProfile);

module.exports = {
    profileRoutes: router,
};
