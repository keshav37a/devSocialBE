const express = require('express');

const {
    deleteConnectionRequestByConnectionRequestId,
    deleteConnectionRequestByUserId,
    getAllConnectionRequests,
    sendConnectionRequestToUser,
} = require('../controllers/connectionController');

const { userAuth, adminAuth } = require('../middlewares/auth');

const router = express.Router();

/* Admin routes */
router.get('/all', adminAuth, getAllConnectionRequests);
router.delete('/delete/:toUserId', adminAuth, deleteConnectionRequestByUserId);
router.delete(
    '/delete/connection-request-id/:connectionRequestId',
    adminAuth,
    deleteConnectionRequestByConnectionRequestId
);

/* Customer routes */
router.post('/send/:status/:toUserId', userAuth, sendConnectionRequestToUser);

module.exports = {
    connectionRequestRoutes: router,
};
