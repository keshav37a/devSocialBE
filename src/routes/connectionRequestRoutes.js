const express = require('express');

const {
    deleteConnectionRequestByConnectionRequestId,
    deleteConnectionRequestByUserId,
    getAllConnectionRequests,
    sendConnectionRequest,
    getAllConnectionReviewRequestsByUser,
    reviewConnectionRequest,
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
router.post('/send/:status/:toUserId', userAuth, sendConnectionRequest);
router.get('/review-requests', userAuth, getAllConnectionReviewRequestsByUser);
router.post('/review/:status/:connectionRequestId', userAuth, reviewConnectionRequest);

module.exports = {
    connectionRequestRoutes: router,
};
