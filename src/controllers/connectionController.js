import { ConnectionRequestModel } from '#Models/connectionRequestModel'
import { UserModel } from '#Models/userModel'

import {
    validateCreateConnectionByUserIds,
    validateDeleteConnectionRequestByConnectionRequestId,
    validateDeleteConnectionRequestByEmail,
    validateDeleteConnectionRequestByUserId,
    validateRemoveConnection,
    validateReviewConnectionRequest,
    validateSendConnectionRequest,
} from '#Validations/connectionRequestValidation'
import { validateIsUserSignedIn } from '#Validations/userValidation'

import {
    throwConnectionRequestAlreadyExistsForTheseUsers,
    throwConnectionRequestNotFoundForTheseUsers,
    throwConnectionRequestNotFoundForThisConnectionRequestId,
    throwUserNotFoundError,
} from '#Utils/errorUtils'
import { sendStandardResponse } from '#Utils/responseUtils'

import { USER } from '#Config/keys'

export const createConnectionByUserIds = async (req, res) => {
    /* Admin controller only */
    try {
        validateCreateConnectionByUserIds(req)
        const { toUserId, fromUserId } = req.body
        const connectionRequest = await ConnectionRequestModel.findOne({
            $or: [
                { toUser: toUserId, fromUser: fromUserId },
                { toUser: fromUserId, fromUser: toUserId },
            ],
        })
        if (connectionRequest) {
            throwConnectionRequestAlreadyExistsForTheseUsers()
        }
        const newConnectionRequest = ConnectionRequestModel({
            fromUser: fromUserId,
            toUser: toUserId,
            status: 'accepted',
        })
        await newConnectionRequest.save()
        sendStandardResponse(res, {
            message: 'Connection created successfully',
            data: { connectionRequest: newConnectionRequest },
        })
    } catch (error) {
        sendStandardResponse(res, { message: error.message, data: { connectionRequests: null }, error })
    }
}

export const deleteConnectionRequestByConnectionRequestId = async (req, res) => {
    /* Admin controller only */
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

export const deleteConnectionRequestByEmail = async (req, res) => {
    /* Admin controller only */
    try {
        validateDeleteConnectionRequestByEmail(req)
        const { fromUserEmail, toUserEmail } = req.body
        const fromUser = await UserModel.findOne({ email: fromUserEmail })
        if (!fromUser) {
            throwUserNotFoundError()
        }
        const toUser = await UserModel.findOne({ email: toUserEmail })
        if (!toUser) {
            throwUserNotFoundError()
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

export const deleteConnectionRequestByUserId = async (req, res) => {
    /* Admin controller only */
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

export const getAllConnectionRequests = async (_, res) => {
    /* Admin controller only */
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

export const getConnectionsByUser = async (req, res) => {
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

export const getPendingConnectionRequestsForReviewByUser = async (req, res) => {
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

export const removeConnection = async (req, res) => {
    try {
        validateRemoveConnection(req)
        const { _id: fromUserId } = req.user
        const { userId: toUserId } = req.params

        const connectionRequest = await ConnectionRequestModel.findOneAndDelete({
            $or: [
                { toUser: toUserId, fromUser: fromUserId },
                { toUser: fromUserId, fromUser: toUserId },
            ],
        })

        if (!connectionRequest) {
            throwConnectionRequestNotFoundForTheseUsers()
        }

        sendStandardResponse(res, {
            message: 'Connection deleted successfully',
            data: { connectionRequest },
        })
    } catch (error) {
        sendStandardResponse(res, { message: error.message, data: { connectionRequest: null }, error })
    }
}

export const reviewConnectionRequest = async (req, res) => {
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

export const sendConnectionRequest = async (req, res) => {
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
