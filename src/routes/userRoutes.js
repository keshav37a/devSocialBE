const express = require('express');

const {
    deleteUserByEmail,
    deleteUserById,
    getAllUsers,
    getUserById,
    updateUser,
} = require('../controllers/userController');
const { adminAuth } = require('../middlewares/auth');

const router = express.Router();

/* Admin only routes */
router.delete('/delete', adminAuth, deleteUserByEmail);
router.delete('/delete/:userId', adminAuth, deleteUserById);
router.get('/all', adminAuth, getAllUsers);
router.get('/:userId', adminAuth, getUserById);
router.patch('/update/:userId', adminAuth, updateUser);

module.exports = {
    userRoutes: router,
};
