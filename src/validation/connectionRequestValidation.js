const mongoose = require('mongoose');
const { ConnectionRequestModel } = require('../models/connectionRequestModel');
const {
    throwConnectionRequestAlreadyExistsForTheseUsers,
    throwConnectionRequestAlreadyReviewedError,
    throwInvalidDataError,
    throwMissingConnectionRequestError,
    throwMissingToUserInConnectionRequestError,
    throwSameToUserAndFromUserInConnectionRequestError,
    throwUserForbiddenError,
    throwUserNotFoundError,
    throwConnectionRequestNotFoundForThisConnectionRequestId,
    throwUserIdNotMatchingWithToUserId,
} = require('../utils/errorUtils');
const { UserModel } = require('../models/userModel');

const validateDeleteConnectionRequestByConnectionRequestId = (req) => {
    const user = req.user;
    if (!user) {
        throwUserForbiddenError();
    }
    const { connectionRequestId } = req.params;
    if (!connectionRequestId) {
        throwMissingConnectionRequestError();
    }
    if (!mongoose.Types.ObjectId.isValid(connectionRequestId)) {
        throwInvalidDataError('connectionRequestId', connectionRequestId);
    }
};

const validateDeleteConnectionRequestByUserId = async (req) => {
    const user = req.user;
    if (!user) {
        throwUserForbiddenError();
    }
    const { toUserId } = req.params;
    if (!toUserId) {
        throwMissingToUserInConnectionRequestError();
    }
    if (!mongoose.Types.ObjectId.isValid(toUserId)) {
        throwInvalidDataError('userId', toUserId);
    }
};

const validateGetAllConnectionReviewRequestsByUser = (req) => {
    const user = req.user;
    if (!user) {
        throwUserForbiddenError();
    }
};

const validateReviewConnectionRequest = async (req) => {
    const user = req.user;
    if (!user) {
        throwUserForbiddenError();
    }
    const reviewerUserId = user._id;
    const { status, connectionRequestId } = req.params;
    const allowedStatuses = ['accepted', 'rejected'];
    if (!allowedStatuses.includes(status)) {
        throwInvalidDataError('status', status);
    }
    const connectionRequest = await ConnectionRequestModel.findById(connectionRequestId);
    if (!connectionRequest) {
        throwConnectionRequestNotFoundForThisConnectionRequestId();
    }
    if (!connectionRequest.toUserId.equals(reviewerUserId)) {
        throwUserIdNotMatchingWithToUserId();
    }
    if (allowedStatuses.includes(connectionRequest.status)) {
        throwConnectionRequestAlreadyReviewedError();
    }
    return connectionRequest;
};

const validateSendConnectionRequest = async (req) => {
    const user = req.user;
    if (!user) {
        throwUserForbiddenError();
    }

    const { toUserId } = req.params;
    const fromUserId = req.user._id;

    if (!toUserId) {
        throwMissingToUserInConnectionRequestError();
    }
    if (!mongoose.Types.ObjectId.isValid(toUserId)) {
        throwInvalidDataError('userId', toUserId);
    }
    const isToUserExists = await UserModel.findById(toUserId);
    if (!isToUserExists) {
        throwUserNotFoundError('userId');
    }
    if (fromUserId === toUserId) {
        throwSameToUserAndFromUserInConnectionRequestError();
    }
    const { status } = req.params;
    const allowedStatuses = ['interested', 'ignored'];
    if (!allowedStatuses.includes(status)) {
        throwInvalidDataError('status', status);
    }

    const existingConnectionRequest = await ConnectionRequestModel.findOne({
        $or: [
            { fromUserId, toUserId },
            { fromUserId: toUserId, toUserId: fromUserId },
        ],
    });
    if (existingConnectionRequest) {
        throwConnectionRequestAlreadyExistsForTheseUsers();
    }
};

module.exports = {
    validateDeleteConnectionRequestByConnectionRequestId,
    validateDeleteConnectionRequestByUserId,
    validateGetAllConnectionReviewRequestsByUser,
    validateReviewConnectionRequest,
    validateSendConnectionRequest,
};
