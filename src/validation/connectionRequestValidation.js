const mongoose = require('mongoose');
const { ConnectionRequestModel } = require('../models/connectionRequestModel');
const {
    throwConnectionRequestAlreadyExistsForTheseUsers,
    throwInvalidDataError,
    throwMissingToUserInConnectionRequestError,
    throwUserForbiddenError,
} = require('../utils/errorUtils');

const validateDeleteConnectionRequestByUserId = async (req) => {
    const user = req.user;
    if (!user) {
        throwUserForbiddenError();
    }
    const toUserId = req.params?.toUserId;
    if (!toUserId) {
        throwMissingToUserInConnectionRequestError();
    }
    if (!mongoose.Types.ObjectId.isValid(toUserId)) {
        throwInvalidDataError('userId');
    }
};

const validateSendConnectionRequestToUser = async (req) => {
    const user = req.user;
    if (!user) {
        throwUserForbiddenError();
    }

    const toUserId = req.params?.toUserId;
    if (!toUserId) {
        throwMissingToUserInConnectionRequestError();
    }
    if (!mongoose.Types.ObjectId.isValid(toUserId)) {
        throwInvalidDataError('userId');
    }

    const fromUserId = req.user._id;
    const existingConnectionRequest = await ConnectionRequestModel.findOne({ fromUserId, toUserId });
    if (existingConnectionRequest) {
        throwConnectionRequestAlreadyExistsForTheseUsers();
    }
};

module.exports = {
    validateDeleteConnectionRequestByUserId,
    validateSendConnectionRequestToUser,
};
