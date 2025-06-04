import { Schema, model } from 'mongoose'

const chatMessageSchema = new Schema(
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
        message: {
            type: Schema.Types.String,
            required: true,
            trim: true,
        },
        roomId: {
            type: Schema.Types.String,
            required: true,
            trim: true,
        },
        sentAt: {
            type: Schema.Types.Date,
        },
        receivedAt: {
            type: Schema.Types.Date,
        },
    },
    { timestamps: true }
)

export const ChatMessageModel = model('ChatMessage', chatMessageSchema)
