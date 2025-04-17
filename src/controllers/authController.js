import { hash } from 'bcrypt'

import { UserModel } from '#Models/userModel'

import { USER } from '#Config/keys'

import { throwEmailAlreadyInUseError, throwIncorrectPasswordError, throwUserNotFoundError } from '#Utils/errorUtils'
import { sendStandardResponse } from '#Utils/responseUtils'

import { validateUserSignIn, validateUserSignUp } from '#Validations/authValidation'

export const signInUser = async (req, res) => {
    try {
        validateUserSignIn(req)
        const { email, password } = req.body
        const user = await UserModel.findOne({ email })
        if (!user) {
            throwUserNotFoundError('email', email)
        }

        const isPasswordMatch = await user.validatePassword(password)
        if (!isPasswordMatch) {
            throwIncorrectPasswordError()
        }

        const token = await user.getJWT()
        user.password = null
        res.cookie('token', token)
        sendStandardResponse(res, { message: 'User authenticated', data: { user } })
    } catch (error) {
        sendStandardResponse(res, { message: error.message, data: { user: null }, error })
    }
}

export const signOutUser = (_, res) => {
    try {
        res.cookie('token', null, {
            expires: new Date(Date.now()),
        })
        sendStandardResponse(res, { message: 'User signed out successfully', data: { user: null } })
    } catch (error) {
        sendStandardResponse(res, { message: error.message, data: { user: null }, error })
    }
}

export const signUpNewUser = async (req, res) => {
    try {
        validateUserSignUp(req)
        const { firstName, lastName, email, password, dob, gender, type, mobile, photoUrl, about, skills } = req.body
        const existingUser = await UserModel.findOne({ email })

        if (existingUser) {
            throwEmailAlreadyInUseError()
        }

        const passwordHash = await hash(password, USER.PASSWORD_SALT_ROUNDS)
        const newUser = UserModel({
            firstName,
            lastName,
            email,
            password: passwordHash,
            dob,
            gender,
            type,
            mobile,
            photoUrl,
            about,
            skills,
        })
        const newSavedUser = await newUser.save()
        sendStandardResponse(res, { message: 'User created successfully', data: { user: newSavedUser } })
    } catch (error) {
        sendStandardResponse(res, { message: error.message, data: { user: null }, error })
    }
}
