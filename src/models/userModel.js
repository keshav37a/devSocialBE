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

userSchema.virtual('fullName').get(function () {
    return `${this.firstName} ${this.lastName}`
})

userSchema.virtual('age').get(function () {
    if (!this.dob) {
        return null
    }
    const today = new Date()
    const birthDate = new Date(this.dob)

    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    const dayDiff = today.getDate() - birthDate.getDate()

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--
    }
    return age
})

userSchema.virtual('formattedDob').get(function () {
    if (!this.dob) {
        return null
    }
    const birthDate = new Date(this.dob)

    const month = birthDate.getMonth()
    const date = birthDate.getDate()

    const dateString = date > 9 ? date : `0${date}`
    const monthString = month > 8 ? month + 1 : `0${month + 1}`
    const yearString = birthDate.getFullYear()

    return `${yearString}-${monthString}-${dateString}`
})

userSchema.virtual('genderOptionsDisplay').get(() => {
    return [
        { displayName: 'Male', value: 'male' },
        { displayName: 'Female', value: 'female' },
        { displayName: 'Other', value: 'other' },
    ]
})

userSchema.set('toJSON', { virtuals: true })
userSchema.set('toObject', { virtuals: true })

export const UserModel = model('User', userSchema)
