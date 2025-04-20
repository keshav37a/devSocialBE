import mongoose from 'mongoose'

import { ConnectionRequestModel } from '#Models/connectionRequestModel'
import { UserModel } from '#Models/userModel'

import { validateIsUserSignedIn } from '#Validations/userValidation'

import {
    throwConnectionRequestAlreadyExistsForTheseUsers,
    throwConnectionRequestAlreadyReviewedError,
    throwConnectionRequestNotFoundForThisConnectionRequestId,
    throwInvalidDataError,
    throwMissingConnectionRequestError,
    throwMissingDataError,
    throwMissingFromUserInConnectionRequestError,
    throwMissingToUserInConnectionRequestError,
    throwSameToUserAndFromUserInConnectionRequestError,
    throwUserIdNotMatchingWithToUser,
    throwUserNotFoundError,
} from '#Utils/errorUtils'

export const validateDeleteConnectionRequestByConnectionRequestId = (req) => {
    validateIsUserSignedIn()
    const { connectionRequestId } = req.params
    if (!connectionRequestId) {
        throwMissingConnectionRequestError()
    }
    if (!mongoose.Types.ObjectId.isValid(connectionRequestId)) {
        throwInvalidDataError('connectionRequestId', connectionRequestId)
    }
}

export const validateDeleteConnectionRequestByEmail = (req) => {
    const { fromUserEmail, toUserEmail } = req.body
    if (!fromUserEmail) {
        throwMissingDataError('fromUserEmail')
    }
    if (!toUserEmail) {
        throwMissingDataError('toUserEmail')
    }
}

export const validateDeleteConnectionRequestByUserId = (req) => {
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

export const validateReviewConnectionRequest = async (req) => {
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

export const validateSendConnectionRequest = async (req) => {
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
        throwUserNotFoundError()
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
