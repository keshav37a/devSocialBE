const { ConnectionRequestModel } = require('../models/connectionRequestModel');
const {
    throwConnectionRequestNotFoundForThisConnectionRequestId,
    throwConnectionRequestNotFoundForTheseUsers,
} = require('../utils/errorUtils');
const { sendStandardResponse } = require('../utils/responseUtils');
const {
    validateDeleteConnectionRequestByConnectionRequestId,
    validateDeleteConnectionRequestByUserId,
    validateGetAllConnectionReviewRequestsByUser,
    validateReviewConnectionRequest,
    validateSendConnectionRequest,
} = require('../validation/connectionRequestValidation');

const deleteConnectionRequestByConnectionRequestId = async (req, res) => {
    try {
        validateDeleteConnectionRequestByConnectionRequestId(req);
        const { connectionRequestId } = req.params;
        const connectionRequest = await ConnectionRequestModel.findByIdAndDelete(connectionRequestId);
        if (!connectionRequest) {
            throwConnectionRequestNotFoundForThisConnectionRequestId();
        }
        sendStandardResponse(res, {
            message: 'Connection request deleted successfully',
            data: {
                connectionRequest: {
                    _id: connectionRequest._id,
                },
            },
        });
    } catch (error) {
        sendStandardResponse(res, { message: error.message, data: { connectionRequests: null }, error });
    }
};

const deleteConnectionRequestByUserId = async (req, res) => {
    try {
        validateDeleteConnectionRequestByUserId(req);
        const fromUserId = req.user._id;
        const { toUserId } = req.params;
        const connectionRequest = await ConnectionRequestModel.findOneAndDelete({ fromUserId, toUserId });
        if (!connectionRequest) {
            throwConnectionRequestNotFoundForTheseUsers();
        }
        sendStandardResponse(res, {
            message: 'Connection request deleted successfully',
            data: {
                connectionRequest: {
                    _id: connectionRequest._id,
                },
            },
        });
    } catch (error) {
        sendStandardResponse(res, { message: error.message, data: { connectionRequests: null }, error });
    }
};

const getAllConnectionRequests = async (_, res) => {
    try {
        const allConnectionRequests = await ConnectionRequestModel.find({});
        sendStandardResponse(res, {
            message: 'Connection requests fetched successfully',
            data: { connectionRequests: allConnectionRequests },
        });
    } catch (error) {
        sendStandardResponse(res, { message: error.message, data: { connectionRequests: null }, error });
    }
};

const getAllConnectionReviewRequestsByUser = async (req, res) => {
    try {
        validateGetAllConnectionReviewRequestsByUser(req);
        const userId = req.user._id;
        const allConnectionRequests = await ConnectionRequestModel.find({ toUserId: userId });
        sendStandardResponse(res, {
            message: 'Connection requests fetched successfully',
            data: { connectionRequests: allConnectionRequests },
        });
    } catch (error) {
        sendStandardResponse(res, { message: error.message, data: { connectionRequests: null }, error });
    }
};

const sendConnectionRequest = async (req, res) => {
    try {
        await validateSendConnectionRequest(req);
        const { status, toUserId } = req.params;
        const fromUserId = req.user._id;
        const newConnectionRequest = ConnectionRequestModel({ fromUserId, toUserId, status });
        await newConnectionRequest.save();
        sendStandardResponse(res, {
            message: 'Connection request sent successfully',
            data: { connectionRequest: newConnectionRequest },
        });
    } catch (error) {
        sendStandardResponse(res, { message: error.message, data: { connectionRequest: null }, error });
    }
};

const reviewConnectionRequest = async (req, res) => {
    try {
        const connectionRequest = await validateReviewConnectionRequest(req);
        const { status } = req.params;
        connectionRequest.status = status;
        await connectionRequest.save();

        sendStandardResponse(res, {
            message: 'Connection request reviewed successfully',
            data: { connectionRequest },
        });
    } catch (error) {
        sendStandardResponse(res, { message: error.message, data: { connectionRequest: null }, error });
    }
};

module.exports = {
    deleteConnectionRequestByConnectionRequestId,
    deleteConnectionRequestByUserId,
    getAllConnectionRequests,
    getAllConnectionReviewRequestsByUser,
    reviewConnectionRequest,
    sendConnectionRequest,
};
