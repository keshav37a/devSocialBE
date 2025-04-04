const express = require('express');

const { getUserProfile, updateUserProfile, changePasswordAsSignedInUser } = require('../controllers/profileController');
const { userAuth } = require('../middlewares/auth');

const router = express.Router();

/* Customer routes */
router.post('/change-password', userAuth, changePasswordAsSignedInUser);
router.patch('/edit', userAuth, updateUserProfile);
router.get('/view', userAuth, getUserProfile);

module.exports = {
    profileRoutes: router,
};
