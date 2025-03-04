const { Schema, model } = require('mongoose');
const validator = require('validator');

const userSchema = new Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true,
            minLength: 2,
            maxLength: 30,
        },
        lastName: {
            type: String,
            required: true,
            trim: true,
            minLength: 2,
            maxLength: 30,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            maxLength: 60,
            validate: {
                validator: (value) => validator.isEmail(value),
                message: 'Schema validation error. Invalid email',
            },
        },
        password: {
            type: String,
            required: true,
            maxLength: 30,
        },
        dob: {
            type: Date,
            validate: {
                validator: (value) => validator.isDate(value),
                message: 'Schema validation error. Invalid dob',
            },
        },
        gender: {
            type: String,
            enum: ['male', 'female', 'other'],
            trim: true,
        },
        type: {
            type: String,
            enum: ['admin', 'customer'],
            default: 'customer',
            trim: true,
        },
        mobile: {
            type: String,
            unique: true,
            trim: true,
            maxLength: 20,
        },
        photoUrl: {
            type: String,
            trim: true,
            maxLength: 150,
            validate: {
                validator: (url) => validator.isURL(url),
                message: 'Schema validation error. Invalid photoUrl.',
            },
        },
        about: {
            type: String,
            trim: true,
            maxLength: 300,
        },
        skills: {
            type: [String],
            validate: {
                validator: (skills) => skills.length < 6,
                message: 'Schema validation error. Count of skills must be less than 5',
            },
        },
    },
    { timestamps: true }
);

const UserModel = model('User', userSchema);

module.exports = {
    UserModel,
};
