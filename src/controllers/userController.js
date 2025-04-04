const { UserModel } = require('../models/userModel');

const { throwUserNotFoundError } = require('../utils/errorUtils');
const {
    validateDeleteUserByEmail,
    validateDeleteUserById,
    validateGetUserById,
    validateUpdateUser,
} = require('../validation/userValidation');
const { sendStandardResponse } = require('../utils/responseUtils');

const deleteUserByEmail = async (req, res) => {
    try {
        validateDeleteUserByEmail(req);
        const { email } = req.body;
        const deletedUser = await UserModel.findOneAndDelete({ email });
        if (!deletedUser) {
            throwUserNotFoundError('email');
        }
        sendStandardResponse(res, { message: 'User deleted successfuly', data: { user: deletedUser } });
    } catch (error) {
        sendStandardResponse(res, { message: error.message, data: { user: null }, error });
    }
};

const deleteUserById = async (req, res) => {
    try {
        validateDeleteUserById(req);
        const userId = req.params.userId;
        const deletedUser = await UserModel.findByIdAndDelete(userId);
        if (!deletedUser) {
            throwUserNotFoundError('userId');
        }
        sendStandardResponse(res, { message: 'User deleted successfuly', data: { user: deletedUser } });
    } catch (error) {
        sendStandardResponse(res, { message: error.message, data: { user: null }, error });
    }
};

const getAllUsers = async (_, res) => {
    try {
        const users = await UserModel.find();
        sendStandardResponse(res, { message: 'All users fetched successfuly', data: { users } });
    } catch (error) {
        sendStandardResponse(res, { message: error.message, data: { user: null }, error });
    }
};

const getUserById = async (req, res) => {
    try {
        validateGetUserById(req);
        const userId = req.params.userId;
        const user = await UserModel.findById(userId);
        if (!user) {
            throwUserNotFoundError('userId');
        }
        sendStandardResponse(res, { message: 'User fetched successfully', data: { user } });
    } catch (error) {
        sendStandardResponse(res, { message: error.message, data: { user: null }, error });
    }
};

const updateUser = async (req, res) => {
    try {
        validateUpdateUser(req);
        const userId = req.params.userId;
        const { firstName, lastName, email, dob, gender, type, mobile, photoUrl, about, skills } = req.body;
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { firstName, lastName, email, dob, gender, type, mobile, photoUrl, about, skills },
            { new: true }
        );
        if (!updatedUser) {
            throwUserNotFoundError('userId');
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
    updateUser,
};
