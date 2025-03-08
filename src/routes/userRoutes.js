const express = require('express');
const { userAuth } = require('../middlewares/auth');
const {
    signUpNewUser,
    deleteUserByEmail,
    deleteUserById,
    getAllUsers,
    getUserById,
    updateUser,
    signIn,
} = require('../controllers/userController');

const router = express.Router();

router.get('/all', userAuth, getAllUsers);
router.get('/:userId', userAuth, getUserById);
router.post('/signup', signUpNewUser);
router.post('/signin', signIn);
router.patch('/update', userAuth, updateUser);
router.delete('/delete', userAuth, deleteUserByEmail);
router.delete('/delete/:userId', userAuth, deleteUserById);

module.exports = {
    userRoutes: router,
};
