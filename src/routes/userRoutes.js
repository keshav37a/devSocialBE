const express = require('express');
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

router.get('/all', getAllUsers);
router.get('/:userId', getUserById);
router.post('/signup', signUpNewUser);
router.post('/signin', signIn);
router.patch('/update', updateUser);
router.delete('/delete', deleteUserByEmail);
router.delete('/delete/:userId', deleteUserById);

module.exports = {
    userRoutes: router,
};
