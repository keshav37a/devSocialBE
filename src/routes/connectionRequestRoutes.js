const express = require('express');

const {
    deleteConnectionRequestByUserId,
    getAllConnectionRequests,
    sendConnectionRequestToUser,
} = require('../controllers/connectionController');

const { userAuth, adminAuth } = require('../middlewares/auth');

const router = express.Router();

/* Admin routes */
router.get('/all', adminAuth, getAllConnectionRequests);
router.delete('/delete/:toUserId', adminAuth, deleteConnectionRequestByUserId);

/* Customer routes */
router.post('/send/interested/:toUserId', userAuth, sendConnectionRequestToUser);

module.exports = {
    connectionRequestRoutes: router,
};
