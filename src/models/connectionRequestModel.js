import { Schema, model } from 'mongoose'

const connectionRequestSchema = new Schema(
    {
        fromUser: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        toUser: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        status: {
            type: String,
            enum: {
                values: ['accepted', 'rejected', 'interested', 'ignored'],
                message: 'Schema validation error. ${VALUE} is not a valid connection status type',
            },
            trim: true,
            lowercase: true,
            required: true,
        },
    },
    { timestamps: true }
)

connectionRequestSchema.index({ fromUser: 1, toUser: 1 })

connectionRequestSchema.pre('save', function (next) {
    if (this.fromUser.equals(this.toUser)) {
        throw new Error("Schema validation error. fromUser and toUser can't be same.")
    }
    next()
})

export const ConnectionRequestModel = model('ConnectionRequest', connectionRequestSchema)
