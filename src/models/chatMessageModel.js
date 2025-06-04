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
    },
    { timestamps: true }
)

export const ChatMessageModel = model('ChatMessage', chatMessageSchema)
