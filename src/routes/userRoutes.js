const express = require('express');
const { userAuth, adminAuth } = require('../middlewares/auth');
const {
    deleteUserByEmail,
    deleteUserById,
    getAllUsers,
    getUserById,
    getUserProfile,
    signUpNewUser,
    signInUser,
    updateUser,
    updateUserProfile,
} = require('../controllers/userController');

const router = express.Router();

/* Admin only routes */
router.get('/all', adminAuth, getAllUsers);
router.get('/:userId', adminAuth, getUserById);
router.patch('/update', adminAuth, updateUser);
router.delete('/delete', adminAuth, deleteUserByEmail);
router.delete('/delete/:userId', adminAuth, deleteUserById);

/* Customer routes */
router.post('/profile/view', userAuth, getUserProfile);
router.patch('/profile/edit', userAuth, updateUserProfile);
router.post('/signup', signUpNewUser);
router.post('/signin', signInUser);

module.exports = {
    userRoutes: router,
};
