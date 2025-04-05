const { Schema, model } = require('mongoose');

const connectionRequestSchema = new Schema(
    {
        fromUserId: {
            type: Schema.Types.ObjectId,
            required: true,
        },
        toUserId: {
            type: Schema.Types.ObjectId,
            required: true,
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
);

const ConnectionRequestModel = model('ConnectionRequest', connectionRequestSchema);

module.exports = {
    ConnectionRequestModel,
};
