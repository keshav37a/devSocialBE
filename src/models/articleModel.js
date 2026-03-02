import { Schema, model } from 'mongoose'

const articleSchema = new Schema(
    {
        source: {
            type: String,
            default: 'devto',
            index: true,
        },
        sourceId: {
            type: String,
            required: true,
            unique: true,
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        url: {
            type: String,
            required: true,
        },
        published_at: {
            type: Date,
            index: true,
        },
        cover_img: {
            type: String,
        },
        tags: {
            type: [String],
            index: true,
        },
        author: {
            name: { type: String },
            username: { type: String },
            user_id: { type: Number },
            profile_image: { type: String },
        },
        reading_time_minutes: {
            type: Number,
        },
    },
    {
        timestamps: true,
    }
)

export const ArticleModel = model('Article', articleSchema)
