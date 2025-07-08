import { Schema, model } from 'mongoose'

const ChatRoomSchema = new Schema({
    participants: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
    messages: [{ type: Schema.Types.ObjectId, ref: 'ChatMessage' }],
    lastMessage: { type: Schema.Types.ObjectId, ref: 'ChatMessage' },
})

export const ChatRoomModel = model('ChatRoom', ChatRoomSchema)
