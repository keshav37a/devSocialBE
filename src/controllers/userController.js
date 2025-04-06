const { UserModel } = require('../models/userModel');
const { ConnectionRequestModel } = require('../models/connectionRequestModel');

const { throwUserNotFoundError } = require('../utils/errorUtils');
const {
    validateDeleteUserByEmail,
    validateDeleteUserById,
    validateGetUserById,
    validateIsUserSignedIn,
    validateUpdateUser,
} = require('../validation/userValidation');

const { sendStandardResponse } = require('../utils/responseUtils');

const { USER } = require('../config/keys');

const deleteUserByEmail = async (req, res) => {
    try {
        validateDeleteUserByEmail(req);
        const { email } = req.body;
        const deletedUser = await UserModel.findOneAndDelete({ email });
        if (!deletedUser) {
            throwUserNotFoundError('email', email);
        }
        sendStandardResponse(res, { message: 'User deleted successfuly', data: { user: deletedUser } });
    } catch (error) {
        sendStandardResponse(res, { message: error.message, data: { user: null }, error });
    }
};

const deleteUserById = async (req, res) => {
    try {
        validateDeleteUserById(req);
        const { userId } = req.params;
        const deletedUser = await UserModel.findByIdAndDelete(userId);
        if (!deletedUser) {
            throwUserNotFoundError('userId', userId);
        }
        sendStandardResponse(res, { message: 'User deleted successfuly', data: { user: deletedUser } });
    } catch (error) {
        sendStandardResponse(res, { message: error.message, data: { user: null }, error });
    }
};

const getAllUsers = async (_, res) => {
    try {
        const users = await UserModel.find().select(USER.ADMIN_FIELDS);
        sendStandardResponse(res, { message: 'All users fetched successfuly', data: { users } });
    } catch (error) {
        sendStandardResponse(res, { message: error.message, data: { user: null }, error });
    }
};

const getUserById = async (req, res) => {
    try {
        validateGetUserById(req);
        const { userId } = req.params;
        const user = await UserModel.findById(userId).select(USER.ADMIN_FIELDS);
        if (!user) {
            throwUserNotFoundError('userId', userId);
        }
        sendStandardResponse(res, { message: 'User fetched successfully', data: { user } });
    } catch (error) {
        sendStandardResponse(res, { message: error.message, data: { user: null }, error });
    }
};

const getUserFeed = async (req, res) => {
    try {
        validateIsUserSignedIn(req);
        const { _id: loggedInUserId } = req.user;
        const page = Number(req.query.page) || 1;
        let limit = Number(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;
        const skip = (page - 1) * limit;
        const connectionRequestsToBeExcluded = await ConnectionRequestModel.find({
            $or: [{ fromUser: loggedInUserId }, { toUser: loggedInUserId }],
        });
        const excludedUserIds = [];
        connectionRequestsToBeExcluded.forEach(({ fromUser, toUser }) =>
            excludedUserIds.push(fromUser.equals(loggedInUserId) ? toUser.toString() : fromUser.toString())
        );
        const feed = await UserModel.find({
            $and: [{ _id: { $nin: excludedUserIds } }, { _id: { $ne: loggedInUserId } }],
        })
            .select(USER.CUSTOMER_FIELDS)
            .skip(Number(skip))
            .limit(Number(limit));
        sendStandardResponse(res, { message: 'Feed fetched successfully', data: { feed } });
    } catch (error) {
        sendStandardResponse(res, { message: error.message, data: { feed: null }, error });
    }
};

const updateUser = async (req, res) => {
    try {
        validateUpdateUser(req);
        const { userId } = req.params;
        const { firstName, lastName, email, dob, gender, type, mobile, photoUrl, about, skills } = req.body;
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { firstName, lastName, email, dob, gender, type, mobile, photoUrl, about, skills },
            { new: true }
        ).select(USER.ADMIN_FIELDS);
        if (!updatedUser) {
            throwUserNotFoundError('userId', userId);
        }
        sendStandardResponse(res, { message: 'User updated successfully', data: { user: updatedUser } });
    } catch (error) {
        sendStandardResponse(res, { message: error.message, data: { user: null }, error });
    }
};

module.exports = {
    deleteUserByEmail,
    deleteUserById,
    getAllUsers,
    getUserById,
    getUserFeed,
    updateUser,
};
