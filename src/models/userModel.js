import { compare } from 'bcrypt'
import jwt from 'jsonwebtoken'
import { Schema, model } from 'mongoose'
import validator from 'validator'

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
            enum: {
                values: ['male', 'female', 'other'],
                message: 'Schema validation error. ${VALUE} is not a valid gender.',
            },
            trim: true,
            lowercase: true,
        },
        type: {
            type: String,
            enum: {
                values: ['admin', 'customer'],
                message: 'Schema validation error. ${VALUE} is not a valid user type.',
            },
            default: 'customer',
            trim: true,
            lowercase: true,
        },
        mobile: {
            type: String,
            // unique: true,
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
)

userSchema.methods.getJWT = async function () {
    const user = this
    const token = await jwt.sign({ _id: user._id }, process.env.JWT_TOKEN_SECRET_KEY, {
        expiresIn: '7d',
    })
    return token
}

userSchema.methods.validatePassword = async function (passwordInput) {
    const user = this
    const isPasswordMatch = await compare(passwordInput, user.password)
    return isPasswordMatch
}

export const UserModel = model('User', userSchema)
