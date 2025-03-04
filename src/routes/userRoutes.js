const express = require('express');
const {
    createNewUser,
    deleteUserByEmail,
    deleteUserById,
    getAllUsers,
    getUserById,
    updateUser,
} = require('../controllers/userController');

const router = express.Router();

router.get('/all', getAllUsers);
router.get('/:userId', getUserById);
router.post('/signup', createNewUser);
router.patch('/update', updateUser);
router.delete('/delete', deleteUserByEmail);
router.delete('/delete/:userId', deleteUserById);

module.exports = {
    userRoutes: router,
};
