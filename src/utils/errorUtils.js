const { REQUEST_STATUS } = require('#Config/keys')

const throwConnectionRequestAlreadyExistsForTheseUsers = () => {
    throw new Error(`API validation error. A connection request already exists for these users`, {
        cause: REQUEST_STATUS.BAD_REQUEST,
    })
}

const throwConnectionRequestNotFoundForThisConnectionRequestId = () => {
    throw new Error(`API validation error. A connection request for this connection request id does not exist`, {
        cause: REQUEST_STATUS.NOT_FOUND,
    })
}

const throwUserIdNotMatchingWithToUser = () => {
    throw new Error(
        `API validation error. The logged in userId does not match with the toUser in the connectionRequest`,
        {
            cause: REQUEST_STATUS.BAD_REQUEST,
        }
    )
}

const throwConnectionRequestAlreadyReviewedError = () => {
    throw new Error(`API validation error. The connection request has already been reviewed`, {
        cause: REQUEST_STATUS.NOT_FOUND,
    })
}

const throwConnectionRequestNotFoundForTheseUsers = () => {
    throw new Error(`API validation error. A connection request for these users does not exist`, {
        cause: REQUEST_STATUS.NOT_FOUND,
    })
}

const throwEmailAlreadyInUseError = () => {
    throw new Error(`API validation error. email already in use`, {
        cause: REQUEST_STATUS.BAD_REQUEST,
    })
}

const throwIncorrectPasswordError = () => {
    throw new Error('API validation error. Incorrect password', {
        cause: REQUEST_STATUS.BAD_REQUEST,
    })
}

const throwInvalidDataError = (fieldName, invalidFieldValue) => {
    throw new Error(`API validation error. Invalid ${fieldName}: ${invalidFieldValue}`, {
        cause: REQUEST_STATUS.BAD_REQUEST,
    })
}

const throwInvalidTokenError = () => {
    throw new Error('API validation error. Invalid token. Unauthorized', {
        cause: REQUEST_STATUS.UNAUTHORIZED,
    })
}

const throwInvalidUserProfileUpdateError = () => {
    throw new Error('Invalid profile update request. Some fields are not editable', {
        cause: REQUEST_STATUS.BAD_REQUEST,
    })
}

const throwMissingDataError = (missingData) => {
    throw new Error(`API validation error. ${missingData} missing`, {
        cause: REQUEST_STATUS.BAD_REQUEST,
    })
}

const throwMissingConnectionRequestError = () => {
    throw new Error(`API validation error. Connection request id missing in request`, {
        cause: REQUEST_STATUS.BAD_REQUEST,
    })
}

const throwMissingFromUserInConnectionRequestError = () => {
    throw new Error(`API validation error. fromUser missing in request`, {
        cause: REQUEST_STATUS.NOT_FOUND,
    })
}

const throwMissingToUserInConnectionRequestError = () => {
    throw new Error(`API validation error. toUser missing in request`, {
        cause: REQUEST_STATUS.NOT_FOUND,
    })
}

const throwSameCurrentPasswordNewPasswordError = () => {
    throw new Error(`API validation error. New password can't be same as current password.`, {
        cause: REQUEST_STATUS.BAD_REQUEST,
    })
}

const throwSameToUserAndFromUserInConnectionRequestError = () => {
    throw new Error(`API validation error. A connection request can't have the same from user and to user id`, {
        cause: REQUEST_STATUS.BAD_REQUEST,
    })
}

const throwTokenNotFoundError = () => {
    throw new Error('API validation error. Token not found. Unauthorized', {
        cause: REQUEST_STATUS.UNAUTHORIZED,
    })
}

const throwUserSkillCountError = () => {
    throw new Error("API validation error. skills can't be more than 5", {
        cause: REQUEST_STATUS.BAD_REQUEST,
    })
}

const throwUserForbiddenError = () => {
    throw new Error('API validation error. User is forbidden.', {
        cause: REQUEST_STATUS.FORBIDDEN,
    })
}

const throwUserNotFoundError = (fieldName, fieldNotFoundValue) => {
    throw new Error(`API validation error. User not found. ${fieldName}: ${fieldNotFoundValue} not present in DB`, {
        cause: REQUEST_STATUS.NOT_FOUND,
    })
}

module.exports = {
    throwConnectionRequestAlreadyExistsForTheseUsers,
    throwConnectionRequestAlreadyReviewedError,
    throwConnectionRequestNotFoundForThisConnectionRequestId,
    throwConnectionRequestNotFoundForTheseUsers,
    throwEmailAlreadyInUseError,
    throwIncorrectPasswordError,
    throwInvalidDataError,
    throwInvalidTokenError,
    throwInvalidUserProfileUpdateError,
    throwMissingConnectionRequestError,
    throwMissingDataError,
    throwMissingFromUserInConnectionRequestError,
    throwMissingToUserInConnectionRequestError,
    throwSameCurrentPasswordNewPasswordError,
    throwSameToUserAndFromUserInConnectionRequestError,
    throwTokenNotFoundError,
    throwUserIdNotMatchingWithToUser,
    throwUserForbiddenError,
    throwUserNotFoundError,
    throwUserSkillCountError,
}
