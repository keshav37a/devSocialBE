const mongoose = require('mongoose')

const { throwInvalidDataError, throwMissingDataError, throwUserForbiddenError } = require('#Utils/errorUtils')

const validateDeleteUserByEmail = (req) => {
    const { email } = req.body
    if (!email) {
        throwMissingDataError('email')
    }
}

const validateDeleteUserById = (req) => {
    const { userId } = req.params
    validateIsUserSignedIn(req)
    validateUserIdHelper(userId)
}

const validateGetUserById = (req) => {
    const { userId } = req.params
    validateIsUserSignedIn(req)
    validateUserIdHelper(userId)
}

const validateIsUserSignedIn = (req) => {
    const user = req.user
    if (!user) {
        throwUserForbiddenError()
    }
}

const validateUpdateUser = (req) => {
    const { userId } = req.params
    validateUserIdHelper(userId)
}

const validateUserIdHelper = (userId) => {
    if (!userId) {
        throwMissingDataError('userId')
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throwInvalidDataError('userId', userId)
    }
}

module.exports = {
    validateIsUserSignedIn,
    validateDeleteUserByEmail,
    validateDeleteUserById,
    validateGetUserById,
    validateUpdateUser,
    validateUserIdHelper,
}
