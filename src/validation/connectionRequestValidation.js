const mongoose = require('mongoose');
const { ConnectionRequestModel } = require('../models/connectionRequestModel');
const {
    throwConnectionRequestAlreadyExistsForTheseUsers,
    throwInvalidDataError,
    throwMissingConnectionRequestError,
    throwMissingToUserInConnectionRequestError,
    throwSameToUserAndFromUserInConnectionRequestError,
    throwUserForbiddenError,
    throwUserNotFoundError,
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

const validateSendConnectionRequestToUser = async (req) => {
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
    validateSendConnectionRequestToUser,
};
