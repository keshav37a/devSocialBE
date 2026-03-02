import { ArticleModel } from '#Models/articleModel'

import { refreshDevtoArticlesInDBHelper, fetchDevtoArticles } from '#Services/devToService'

import { sendStandardResponse } from '#Utils/responseUtils'

export const refreshDevtoArticlesInDB = async (_, res) => {
    try {
        const { success, count, error } = await refreshDevtoArticlesInDBHelper()
        if (error) {
            throw new Error("Dev.to articles couldn't be refreshed")
        }
        sendStandardResponse(res, { message: 'Dev.to articles refreshed successfully', data: { count, success } })
    } catch (error) {
        sendStandardResponse(res, { message: error.message, data: { articles: null }, error })
    }
}

export const deleteAllArticles = async (_, res) => {
    try {
        const articles = await ArticleModel.deleteMany({})

        sendStandardResponse(res, {
            message: 'Articles deleted successfully',
            data: { articles },
        })
    } catch (error) {
        sendStandardResponse(res, { message: error.message, data: { chatMessages: null }, error })
    }
}

export const getAllArticles = async (_, res) => {
    try {
        const articles = await ArticleModel.find()
        sendStandardResponse(res, {
            message: 'Articles fetched successfully',
            data: { articles },
        })
    } catch (error) {
        sendStandardResponse(res, { message: error.message, data: { chatMessages: null }, error })
    }
}

export const getDevtoArticles = async (_, res) => {
    try {
        const articles = await fetchDevtoArticles()
        if (!articles) {
            throw new Error("Dev.to articles couldn't be fetched found")
        }
        sendStandardResponse(res, { message: 'Dev.to articles fetched successfully', data: { articles } })
    } catch (error) {
        sendStandardResponse(res, { message: error.message, data: { articles: null }, error })
    }
}
