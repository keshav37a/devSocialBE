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

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

connectionRequestSchema.pre('save', function (next) {
    if (this.fromUserId.equals(this.toUserId)) {
        throw new Error("Schema validation error. fromUserId and toUserId can't be same.");
    }
    next();
});

const ConnectionRequestModel = model('ConnectionRequest', connectionRequestSchema);

module.exports = {
    ConnectionRequestModel,
};
