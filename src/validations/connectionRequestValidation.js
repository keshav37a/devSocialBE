const mongoose = require('mongoose')

const { validateIsUserSignedIn } = require('./userValidation')

const { ConnectionRequestModel } = require('#Models/connectionRequestModel')
const { UserModel } = require('#Models/userModel')

const {
    throwConnectionRequestAlreadyExistsForTheseUsers,
    throwConnectionRequestAlreadyReviewedError,
    throwConnectionRequestNotFoundForThisConnectionRequestId,
    throwInvalidDataError,
    throwMissingConnectionRequestError,
    throwMissingDataError,
    throwMissingFromUserInConnectionRequestError,
    throwMissingToUserInConnectionRequestError,
    throwSameToUserAndFromUserInConnectionRequestError,
    throwUserNotFoundError,
    throwUserIdNotMatchingWithToUser,
} = require('#Utils/errorUtils')

const validateDeleteConnectionRequestByConnectionRequestId = (req) => {
    validateIsUserSignedIn()
    const { connectionRequestId } = req.params
    if (!connectionRequestId) {
        throwMissingConnectionRequestError()
    }
    if (!mongoose.Types.ObjectId.isValid(connectionRequestId)) {
        throwInvalidDataError('connectionRequestId', connectionRequestId)
    }
}

const validateDeleteConnectionRequestByEmail = (req) => {
    const { fromUserEmail, toUserEmail } = req.body
    if (!fromUserEmail) {
        throwMissingDataError('fromUserEmail')
    }
    if (!toUserEmail) {
        throwMissingDataError('toUserEmail')
    }
}

const validateDeleteConnectionRequestByUserId = (req) => {
    const { fromUserId, toUserId } = req.body
    if (!fromUserId) {
        throwMissingFromUserInConnectionRequestError()
    }
    if (!toUserId) {
        throwMissingToUserInConnectionRequestError()
    }
    if (!mongoose.Types.ObjectId.isValid(fromUserId)) {
        throwInvalidDataError('userId', fromUserId)
    }
    if (!mongoose.Types.ObjectId.isValid(toUserId)) {
        throwInvalidDataError('userId', toUserId)
    }
}

const validateReviewConnectionRequest = async (req) => {
    const user = req.user
    validateIsUserSignedIn(req)
    const loggedInUserId = user._id
    const { status, connectionRequestId } = req.params
    const allowedStatuses = ['accepted', 'rejected']
    if (!allowedStatuses.includes(status)) {
        throwInvalidDataError('status', status)
    }
    const connectionRequest = await ConnectionRequestModel.findById(connectionRequestId)
    if (!connectionRequest) {
        throwConnectionRequestNotFoundForThisConnectionRequestId()
    }
    if (!connectionRequest.toUser.equals(loggedInUserId)) {
        throwUserIdNotMatchingWithToUser()
    }
    if (allowedStatuses.includes(connectionRequest.status)) {
        throwConnectionRequestAlreadyReviewedError()
    }
    return connectionRequest
}

const validateSendConnectionRequest = async (req) => {
    validateIsUserSignedIn(req)

    const { toUser } = req.params
    const fromUser = req.user._id

    if (!toUser) {
        throwMissingToUserInConnectionRequestError()
    }
    if (!mongoose.Types.ObjectId.isValid(toUser)) {
        throwInvalidDataError('userId', toUser)
    }
    const isToUserExists = await UserModel.findById(toUser)
    if (!isToUserExists) {
        throwUserNotFoundError('userId')
    }
    if (fromUser.equals(toUser)) {
        throwSameToUserAndFromUserInConnectionRequestError()
    }
    const { status } = req.params
    const allowedStatuses = ['interested', 'ignored']
    if (!allowedStatuses.includes(status)) {
        throwInvalidDataError('status', status)
    }

    const existingConnectionRequest = await ConnectionRequestModel.findOne({
        $or: [
            { fromUser, toUser },
            { fromUser: toUser, toUser: fromUser },
        ],
    })
    if (existingConnectionRequest) {
        throwConnectionRequestAlreadyExistsForTheseUsers()
    }
}

module.exports = {
    validateDeleteConnectionRequestByConnectionRequestId,
    validateDeleteConnectionRequestByEmail,
    validateDeleteConnectionRequestByUserId,
    validateReviewConnectionRequest,
    validateSendConnectionRequest,
}
