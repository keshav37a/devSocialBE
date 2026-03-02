import { hash } from 'bcrypt'
import { OAuth2Client } from 'google-auth-library'

import { UserModel } from '#Models/userModel'

import {
    validateForgotPassword,
    validateResetPassword,
    validateUserSignIn,
    validateUserSignUp,
} from '#Validations/authValidation'

import { sendEmailInBackground } from '#Utils/emailUtils'
import {
    throwEmailAlreadyInUseError,
    throwIncorrectOtpError,
    throwIncorrectPasswordError,
    throwUserNotFoundError,
} from '#Utils/errorUtils'
import { sendStandardResponse } from '#Utils/responseUtils'

import { USER } from '#Config/keys'

export const forgotPassword = async (req, res) => {
    try {
        validateForgotPassword(req)
        const { email } = req.body
        const user = await UserModel.findOne({ email })
        if (!user) {
            throwUserNotFoundError()
        }
        const value = Math.floor(Math.pow(10, 6) * Math.random())
        const expiry = new Date(new Date().getTime() + 3 * 60 * 1000)
        const otp = {
            value,
            expiry,
        }
        user.otp = otp
        await user.save()
        sendEmailInBackground({
            from: 'no-reply@devsocial.in',
            to: email,
            subject: `DevSocial: OTP for password reset`,
            emailBody: `Your OTP for password reset is ${otp.value}`,
        })
        sendStandardResponse(res, { message: 'OTP sent successfully', data: { otpSent: true } })
    } catch (error) {
        sendStandardResponse(res, { message: error.message, data: { user: null }, error })
    }
}

export const generateUserProfilePasswordHash = async (password) => {
    const passwordHash = await hash(password, USER.PASSWORD_SALT_ROUNDS)
    return passwordHash
}

export const resetPassword = async (req, res) => {
    try {
        validateResetPassword(req)
        const { email, otp, newPassword } = req.body
        const user = await UserModel.findOne({ email })
        if (!user) {
            throwUserNotFoundError()
        }
        const otpFromDB = user.otp
        if (Number(otp) !== Number(otpFromDB.value) || otpFromDB.expiry <= new Date(Date.now())) {
            throwIncorrectOtpError()
        }
        const passwordHash = await generateUserProfilePasswordHash(newPassword)
        user.password = passwordHash
        user.otp = null
        await user.save()
        sendStandardResponse(res, { message: 'Password reset successfully', data: { passwordReset: true } })
    } catch (error) {
        sendStandardResponse(res, { message: error.message, data: { passwordReset: false }, error })
    }
}

export const signInUser = async (req, res) => {
    try {
        validateUserSignIn(req)
        const { email, password } = req.body
        const user = await UserModel.findOne({ email })
        if (!user) {
            throwUserNotFoundError()
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

export const signInUserWithGoogle = async (req, res) => {
    const { token } = req.body
    try {
        const googleClient = new OAuth2Client({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            redirectUri: 'postmessage',
        })
        const { tokens } = await googleClient.getToken(token)
        const ticket = await googleClient.verifyIdToken({
            idToken: tokens.id_token,
            audience: process.env.GOOGLE_CLIENT_ID,
        })

        const payload = ticket.getPayload()
        const { sub, email, given_name, family_name, picture } = payload

        let user = await UserModel.findOne({ email })
        if (!user) {
            user = await UserModel.create({
                googleId: sub,
                email,
                firstName: given_name,
                lastName: family_name,
                photoUrl: picture,
            })
        } else {
            if (!user.googleId) {
                user.googleId = sub
                await user.save()
            }
        }

        const jwtToken = await user.getJWT()
        user.password = null
        res.cookie('token', jwtToken)
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

        const passwordHash = await generateUserProfilePasswordHash(password)
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
