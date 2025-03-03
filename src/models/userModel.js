const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    dob: {
        type: Date,
        required: true,
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        required: true,
    },
    type: {
        type: String,
        enum: ['admin', 'customer'],
        default: 'customer',
    },
    mobile: {
        type: String,
        required: true,
        unique: true,
    },
});

const UserModel = model('User', userSchema);

module.exports = {
    UserModel,
};
