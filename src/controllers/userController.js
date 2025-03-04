const { STATUS_CODES } = require('../config/keys');
const { UserModel } = require('../models/userModel');

const getAllUsers = async (_, res) => {
    try {
        const users = await UserModel.find();
        return res.status(STATUS_CODES.SUCCESS).send({
            users,
            statusCode: STATUS_CODES.SUCCESS,
        });
    } catch (err) {
        return res.status(STATUS_CODES.SERVER_ERROR).send({
            message: err?.message,
            errorCode: err?.errorResponse?.code,
            statusCode: STATUS_CODES.SERVER_ERROR,
        });
    }
};

const getUserById = async (req, res) => {
    try {
        const userId = req.params.userId;
        if (!userId) {
            return res.status(STATUS_CODES.BAD_REQUEST).send({
                message: 'user id missing in params',
                statusCode: STATUS_CODES.BAD_REQUEST,
            });
        }

        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(STATUS_CODES.NOT_FOUND).send({
                user,
                message: 'User not found',
                statusCode: STATUS_CODES.NOT_FOUND,
            });
        }

        return res.status(STATUS_CODES.SUCCESS).send({
            user,
            statusCode: STATUS_CODES.SUCCESS,
        });
    } catch (err) {
        return res.status(STATUS_CODES.SERVER_ERROR).send({
            message: err?.message,
            errorCode: err?.errorResponse?.code,
            statusCode: STATUS_CODES.SERVER_ERROR,
        });
    }
};

const createNewUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password, dob, gender, mobile } = req.body;
        if (!firstName || !lastName || !email || !password || !dob || !gender || !mobile) {
            return res.status(STATUS_CODES.BAD_REQUEST).send({
                message: 'required body params missing',
                statusCode: STATUS_CODES.BAD_REQUEST,
            });
        }
        const newUser = UserModel({ firstName, lastName, email, password, dob, gender, mobile });
        const newSavedUser = await newUser.save();
        return res.status(STATUS_CODES.SUCCESS).send({
            _id: newSavedUser._id,
            message: 'User created successfully',
            statusCode: STATUS_CODES.SUCCESS,
        });
    } catch (err) {
        return res.status(STATUS_CODES.SERVER_ERROR).send({
            message: err?.message,
            errorCode: err?.errorResponse?.code,
            statusCode: STATUS_CODES.SERVER_ERROR,
        });
    }
};

const deleteUserByEmail = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(STATUS_CODES.BAD_REQUEST).send({
                message: 'email missing in body',
                statusCode: STATUS_CODES.BAD_REQUEST,
            });
        }
        const deletedUser = await UserModel.findOneAndDelete({ email });
        if (!deletedUser) {
            return res.status(STATUS_CODES.NOT_FOUND).send({
                _id: deletedUser?._id,
                message: 'User not found',
                statusCode: STATUS_CODES.NOT_FOUND,
            });
        }

        return res.status(STATUS_CODES.SUCCESS).send({
            _id: deletedUser._id,
            message: 'User deleted successfully',
            statusCode: STATUS_CODES.SUCCESS,
        });
    } catch (err) {
        console.log(err);
        return res.status(STATUS_CODES.SERVER_ERROR).send({
            message: err?.message,
            errorCode: err?.errorResponse?.code,
            statusCode: STATUS_CODES.SERVER_ERROR,
        });
    }
};

const deleteUserById = async (req, res) => {
    try {
        const id = req.params.userId;
        if (!id) {
            return res.status(STATUS_CODES.BAD_REQUEST).send({
                message: 'user id missing in params',
                statusCode: STATUS_CODES.BAD_REQUEST,
            });
        }
        const deletedUser = await UserModel.findByIdAndDelete(id);
        return res.status(STATUS_CODES.SUCCESS).send({
            _id: deletedUser._id,
            message: 'User deleted successfully',
            statusCode: STATUS_CODES.SUCCESS,
        });
    } catch (err) {
        console.log(err);
        return res.status(STATUS_CODES.SERVER_ERROR).send({
            message: err?.message,
            errorCode: err?.errorResponse?.code,
            statusCode: STATUS_CODES.SERVER_ERROR,
        });
    }
};

const updateUser = async (req, res) => {
    try {
        const userId = req.body.userId;
        if (!userId) {
            return res.status(STATUS_CODES.BAD_REQUEST).send({
                message: 'user id missing in body',
                statusCode: STATUS_CODES.BAD_REQUEST,
            });
        }
        const updatedUser = await UserModel.findByIdAndUpdate(userId, req.body, { new: true });
        return res.status(STATUS_CODES.SUCCESS).send({
            message: 'user updated successfully',
            user: updatedUser,
            statusCode: STATUS_CODES.SUCCESS,
        });
    } catch (err) {
        console.log(err);
        return res.status(STATUS_CODES.SERVER_ERROR).send({
            message: err?.message,
            errorCode: err?.errorResponse?.code,
            statusCode: STATUS_CODES.SERVER_ERROR,
        });
    }
};

module.exports = {
    createNewUser,
    deleteUserByEmail,
    deleteUserById,
    getAllUsers,
    getUserById,
    updateUser,
};
