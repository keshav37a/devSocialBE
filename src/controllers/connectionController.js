const { ConnectionRequestModel } = require('#Models/connectionRequestModel')
const { UserModel } = require('#Models/userModel')

const { USER } = require('#Config/keys')

const {
    throwConnectionRequestNotFoundForThisConnectionRequestId,
    throwConnectionRequestNotFoundForTheseUsers,
    throwUserNotFoundError,
} = require('#Utils/errorUtils')
const { sendStandardResponse } = require('#Utils/responseUtils')

const {
    validateDeleteConnectionRequestByConnectionRequestId,
    validateDeleteConnectionRequestByEmail,
    validateDeleteConnectionRequestByUserId,
    validateReviewConnectionRequest,
    validateSendConnectionRequest,
} = require('#Validations/connectionRequestValidation')
const { validateIsUserSignedIn } = require('#Validations/userValidation')

const deleteConnectionRequestByConnectionRequestId = async (req, res) => {
    try {
        validateDeleteConnectionRequestByConnectionRequestId(req)
        const { connectionRequestId } = req.params
        const connectionRequest = await ConnectionRequestModel.findByIdAndDelete(connectionRequestId)
        if (!connectionRequest) {
            throwConnectionRequestNotFoundForThisConnectionRequestId()
        }
        sendStandardResponse(res, {
            message: 'Connection request deleted successfully',
            data: {
                connectionRequest: {
                    _id: connectionRequest._id,
                },
            },
        })
    } catch (error) {
        sendStandardResponse(res, { message: error.message, data: { connectionRequests: null }, error })
    }
}

const deleteConnectionRequestByEmail = async (req, res) => {
    try {
        validateDeleteConnectionRequestByEmail(req)
        const { fromUserEmail, toUserEmail } = req.body
        const fromUser = await UserModel.findOne({ email: fromUserEmail })
        if (!fromUser) {
            throwUserNotFoundError('email', fromUserEmail)
        }
        const toUser = await UserModel.findOne({ email: toUserEmail })
        if (!toUser) {
            throwUserNotFoundError('email', toUserEmail)
        }
        const deletedConnectionRequest = await ConnectionRequestModel.findOneAndDelete({
            fromUser: fromUser._id,
            toUser: toUser._id,
        })
        if (!deletedConnectionRequest) {
            throwConnectionRequestNotFoundForTheseUsers()
        }
        sendStandardResponse(res, {
            message: 'Connection request deleted successfully',
            data: {
                connectionRequest: {
                    _id: deletedConnectionRequest._id,
                },
            },
        })
    } catch (error) {
        sendStandardResponse(res, { message: error.message, data: { connectionRequests: null }, error })
    }
}

const deleteConnectionRequestByUserId = async (req, res) => {
    try {
        validateDeleteConnectionRequestByUserId(req)
        const { fromUserId, toUserId } = req.body
        const connectionRequest = await ConnectionRequestModel.findOneAndDelete({
            fromUser: fromUserId,
            toUser: toUserId,
        })
        if (!connectionRequest) {
            throwConnectionRequestNotFoundForTheseUsers()
        }
        sendStandardResponse(res, {
            message: 'Connection request deleted successfully',
            data: {
                connectionRequest: {
                    _id: connectionRequest._id,
                },
            },
        })
    } catch (error) {
        sendStandardResponse(res, { message: error.message, data: { connectionRequests: null }, error })
    }
}

const getAllConnectionRequests = async (_, res) => {
    try {
        const allConnectionRequests = await ConnectionRequestModel.find({})
            .populate('fromUser', USER.ADMIN_FIELDS)
            .populate('toUser', USER.ADMIN_FIELDS)
        sendStandardResponse(res, {
            message: 'Connection requests fetched successfully',
            data: { connectionRequests: allConnectionRequests },
        })
    } catch (error) {
        sendStandardResponse(res, { message: error.message, data: { connectionRequests: null }, error })
    }
}

const getPendingConnectionRequestsForReviewByUser = async (req, res) => {
    /* get pending connection requests for review  */
    try {
        validateIsUserSignedIn(req)
        const toUser = req.user._id
        const allConnectionRequests = await ConnectionRequestModel.find({ toUser, status: 'interested' }).populate(
            'fromUser',
            USER.CUSTOMER_FIELDS
        )
        sendStandardResponse(res, {
            message: 'Connection requests fetched successfully',
            data: { connectionRequests: allConnectionRequests },
        })
    } catch (error) {
        sendStandardResponse(res, { message: error.message, data: { connectionRequests: null }, error })
    }
}

const getConnectionsByUser = async (req, res) => {
    try {
        validateIsUserSignedIn(req)
        const { _id: userId } = req.user
        const connections = await ConnectionRequestModel.find({
            $or: [
                { toUser: userId, status: 'accepted' },
                { fromUser: userId, status: 'accepted' },
            ],
        })
            .populate('fromUser', USER.CUSTOMER_FIELDS)
            .populate('toUser', USER.CUSTOMER_FIELDS)

        const responseData = connections.map(({ toUser, fromUser }) => (toUser._id.equals(userId) ? fromUser : toUser))
        sendStandardResponse(res, {
            message: 'Connections fetched successfully',
            data: { connections: responseData },
        })
    } catch (error) {
        sendStandardResponse(res, { message: error.message, data: { connections: null }, error })
    }
}

const sendConnectionRequest = async (req, res) => {
    try {
        await validateSendConnectionRequest(req)
        const { status, toUser } = req.params
        const fromUser = req.user._id
        const newConnectionRequest = ConnectionRequestModel({ fromUser, toUser, status })
        await newConnectionRequest.save()
        sendStandardResponse(res, {
            message: 'Connection request sent successfully',
            data: { connectionRequest: newConnectionRequest },
        })
    } catch (error) {
        sendStandardResponse(res, { message: error.message, data: { connectionRequest: null }, error })
    }
}

const reviewConnectionRequest = async (req, res) => {
    try {
        const connectionRequest = await validateReviewConnectionRequest(req)
        const { status } = req.params
        connectionRequest.status = status
        await connectionRequest.save()

        sendStandardResponse(res, {
            message: 'Connection request reviewed successfully',
            data: { connectionRequest },
        })
    } catch (error) {
        sendStandardResponse(res, { message: error.message, data: { connectionRequest: null }, error })
    }
}

module.exports = {
    deleteConnectionRequestByConnectionRequestId,
    deleteConnectionRequestByEmail,
    deleteConnectionRequestByUserId,
    getAllConnectionRequests,
    getConnectionsByUser,
    getPendingConnectionRequestsForReviewByUser,
    reviewConnectionRequest,
    sendConnectionRequest,
}
