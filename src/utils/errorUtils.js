import { REQUEST_STATUS } from '#Config/keys'

export const throwConnectionRequestAlreadyExistsForTheseUsers = () => {
    throw new Error(`API validation error. A connection request already exists for these users`, {
        cause: REQUEST_STATUS.BAD_REQUEST,
    })
}

export const throwConnectionRequestNotFoundForThisConnectionRequestId = () => {
    throw new Error(`API validation error. A connection request for this connection request id does not exist`, {
        cause: REQUEST_STATUS.NOT_FOUND,
    })
}

export const throwUserIdNotMatchingWithToUser = () => {
    throw new Error(
        `API validation error. The logged in userId does not match with the toUser in the connectionRequest`,
        {
            cause: REQUEST_STATUS.BAD_REQUEST,
        }
    )
}

export const throwConnectionRequestAlreadyReviewedError = () => {
    throw new Error(`API validation error. The connection request has already been reviewed`, {
        cause: REQUEST_STATUS.NOT_FOUND,
    })
}

export const throwConnectionRequestNotFoundForTheseUsers = () => {
    throw new Error(`API validation error. A connection request for these users does not exist`, {
        cause: REQUEST_STATUS.NOT_FOUND,
    })
}

export const throwEmailAlreadyInUseError = () => {
    throw new Error(`API validation error. email already in use`, {
        cause: REQUEST_STATUS.BAD_REQUEST,
    })
}

export const throwIncorrectPasswordError = () => {
    throw new Error('API validation error. Incorrect password', {
        cause: REQUEST_STATUS.BAD_REQUEST,
    })
}

export const throwInvalidDataError = (fieldName, invalidFieldValue) => {
    throw new Error(`API validation error. Invalid ${fieldName}: ${invalidFieldValue}`, {
        cause: REQUEST_STATUS.BAD_REQUEST,
    })
}

export const throwInvalidTokenError = () => {
    throw new Error('API validation error. Invalid token. Unauthorized', {
        cause: REQUEST_STATUS.UNAUTHORIZED,
    })
}

export const throwInvalidUserProfileUpdateError = () => {
    throw new Error('Invalid profile update request. Some fields are not editable', {
        cause: REQUEST_STATUS.BAD_REQUEST,
    })
}

export const throwMissingDataError = (missingData) => {
    throw new Error(`API validation error. ${missingData} missing`, {
        cause: REQUEST_STATUS.BAD_REQUEST,
    })
}

export const throwMissingConnectionRequestError = () => {
    throw new Error(`API validation error. Connection request id missing in request`, {
        cause: REQUEST_STATUS.BAD_REQUEST,
    })
}

export const throwMissingFromUserInConnectionRequestError = () => {
    throw new Error(`API validation error. fromUser missing in request`, {
        cause: REQUEST_STATUS.NOT_FOUND,
    })
}

export const throwMissingToUserInConnectionRequestError = () => {
    throw new Error(`API validation error. toUser missing in request`, {
        cause: REQUEST_STATUS.NOT_FOUND,
    })
}

export const throwSameCurrentPasswordNewPasswordError = () => {
    throw new Error(`API validation error. New password can't be same as current password.`, {
        cause: REQUEST_STATUS.BAD_REQUEST,
    })
}

export const throwSameToUserAndFromUserInConnectionRequestError = () => {
    throw new Error(`API validation error. A connection request can't have the same from user and to user id`, {
        cause: REQUEST_STATUS.BAD_REQUEST,
    })
}

export const throwTokenNotFoundError = () => {
    throw new Error('API validation error. Token not found. Unauthorized', {
        cause: REQUEST_STATUS.UNAUTHORIZED,
    })
}

export const throwUserSkillCountError = () => {
    throw new Error("API validation error. skills can't be more than 5", {
        cause: REQUEST_STATUS.BAD_REQUEST,
    })
}

export const throwUserForbiddenError = () => {
    throw new Error('API validation error. User is forbidden.', {
        cause: REQUEST_STATUS.FORBIDDEN,
    })
}

export const throwUserNotFoundError = (fieldName, fieldNotFoundValue) => {
    throw new Error(`API validation error. User not found. ${fieldName}: ${fieldNotFoundValue} not present in DB`, {
        cause: REQUEST_STATUS.NOT_FOUND,
    })
}

export const throwFieldShouldBeAnArrayError = (fieldName) => {
    throw new Error(`API validation error. ${fieldName} should be an array`, {
        cause: REQUEST_STATUS.BAD_REQUEST,
    })
}
