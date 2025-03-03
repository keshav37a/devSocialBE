const express = require('express');
const { createNewUser, deleteUserByEmail, deleteUserById, getAllUsers } = require('../controllers/userController');

const router = express.Router();

router.get('/all', getAllUsers);
router.post('/signup', createNewUser);
router.delete('/delete', deleteUserByEmail);
router.delete('/delete/:userId', deleteUserById);

module.exports = {
    userRoutes: router,
};
