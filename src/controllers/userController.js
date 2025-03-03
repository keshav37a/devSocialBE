const { UserModel } = require('../models/userModel');

const getAllUsers = async (_, res) => {
    try {
        const users = await UserModel.find();
        res.status(200).send({
            users,
        });
    } catch (err) {
        res.status(500).send({
            message: err?.message,
            errorCode: err?.errorResponse?.code,
            statusCode: 500,
        });
    }
};

const createNewUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password, dob, gender, mobile } = req.body;
        const newUser = UserModel({ firstName, lastName, email, password, dob, gender, mobile });
        const newSavedUser = await newUser.save();
        console.log(newSavedUser);
        res.status(200).send({
            _id: newSavedUser._id,
            message: 'User created successfully',
            statusCode: 200,
        });
    } catch (err) {
        res.status(500).send({
            message: err?.message,
            errorCode: err?.errorResponse?.code,
            statusCode: 500,
        });
    }
};

const deleteUserByEmail = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            res.status(400).send({
                message: 'email missing',
                statusCode: 400,
            });
        }
        const deletedUser = await UserModel.findOneAndDelete({ email });
        res.status(200).send({
            _id: deletedUser._id,
            message: 'User deleted successfully',
            statusCode: 200,
        });
    } catch (err) {
        console.log(err);
        res.status(500).send({
            message: err?.message,
            errorCode: err?.errorResponse?.code,
            statusCode: 500,
        });
    }
};

const deleteUserById = async (req, res) => {
    try {
        const id = req.params.userId;
        if (!id) {
            res.status(400).send({
                message: 'user id missing',
                statusCode: 400,
            });
        }
        const deletedUser = await UserModel.findByIdAndDelete(id);
        res.status(200).send({
            _id: deletedUser._id,
            message: 'User deleted successfully',
            statusCode: 200,
        });
    } catch (err) {
        console.log(err);
        res.status(500).send({
            message: err?.message,
            errorCode: err?.errorResponse?.code,
            statusCode: 500,
        });
    }
};

module.exports = {
    createNewUser,
    deleteUserByEmail,
    deleteUserById,
    getAllUsers,
};
