import { Schema, model } from 'mongoose'

const chatMessageSchema = new Schema(
    {
        fromUser: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        chatRoom: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'ChatRoom',
        },
        message: {
            type: Schema.Types.String,
            required: true,
            trim: true,
        },
        readBy: [
            {
                user: { type: Schema.Types.ObjectId, ref: 'User' },
                readAt: Date,
            },
        ],
        sentAt: {
            type: Schema.Types.Date,
            required: true,
        },
        receivedAt: {
            type: Schema.Types.Date,
        },
    },
    { versionKey: false }
)

export const ChatMessageModel = model('ChatMessage', chatMessageSchema)
