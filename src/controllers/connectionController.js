const { ConnectionRequestModel } = require('../models/connectionRequestModel');
const { throwConnectionRequestNotFoundForTheseUsers } = require('../utils/errorUtils');
const { sendStandardResponse } = require('../utils/responseUtils');
const {
    validateDeleteConnectionRequestByUserId,
    validateSendConnectionRequestToUser,
} = require('../validation/connectionRequestValidation');

const deleteConnectionRequestByUserId = async (req, res) => {
    try {
        validateDeleteConnectionRequestByUserId(req);
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const connectionRequest = await ConnectionRequestModel.findOneAndDelete({ fromUserId, toUserId });
        if (!connectionRequest) {
            throwConnectionRequestNotFoundForTheseUsers();
        }
        sendStandardResponse(res, {
            message: 'Request deleted successfully',
            data: { connectionRequest: connectionRequest._id },
        });
    } catch (error) {
        sendStandardResponse(res, { message: error.message, data: { connectionRequests: null }, error });
    }
};

const getAllConnectionRequests = async (_, res) => {
    try {
        const allConnectionRequests = await ConnectionRequestModel.find({});
        sendStandardResponse(res, {
            message: 'Request sent successfully',
            data: { connectionRequests: allConnectionRequests },
        });
    } catch (error) {
        sendStandardResponse(res, { message: error.message, data: { connectionRequests: null }, error });
    }
};

const sendConnectionRequestToUser = async (req, res) => {
    try {
        await validateSendConnectionRequestToUser(req);
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = 'interested';
        const newConnectionRequest = ConnectionRequestModel({ fromUserId, toUserId, status });
        await newConnectionRequest.save();
        sendStandardResponse(res, {
            message: 'Request sent successfully',
            data: { connectionRequest: newConnectionRequest },
        });
    } catch (error) {
        sendStandardResponse(res, { message: error.message, data: { connectionRequest: null }, error });
    }
};

module.exports = {
    deleteConnectionRequestByUserId,
    getAllConnectionRequests,
    sendConnectionRequestToUser,
};
