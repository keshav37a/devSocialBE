const express = require('express');

const {
    deleteConnectionRequestByConnectionRequestId,
    deleteConnectionRequestByEmail,
    deleteConnectionRequestByUserId,
    getAllConnectionRequests,
    sendConnectionRequest,
    getPendingConnectionRequestsForReviewByUser,
    reviewConnectionRequest,
} = require('../controllers/connectionController');

const { userAuth, adminAuth } = require('../middlewares/auth');

const router = express.Router();

/* Admin routes */
router.get('/all', adminAuth, getAllConnectionRequests);
router.delete('/delete/email', adminAuth, deleteConnectionRequestByEmail);
router.delete('/delete/user-id', userAuth, deleteConnectionRequestByUserId);
router.delete(
    '/delete/connection-request-id/:connectionRequestId',
    adminAuth,
    deleteConnectionRequestByConnectionRequestId
);

/* Customer routes */
router.post('/send/:status/:toUser', userAuth, sendConnectionRequest);
router.get('/review-requests', userAuth, getPendingConnectionRequestsForReviewByUser);
router.post('/review/:status/:connectionRequestId', userAuth, reviewConnectionRequest);

module.exports = {
    connectionRequestRoutes: router,
};
