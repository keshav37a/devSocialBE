import { ArticleModel } from '#Models/articleModel'

export const fetchDevtoArticles = async () => {
    try {
        const response = await fetch('https://dev.to/api/articles?per_page=100')

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const articles = await response.json()
        return articles
    } catch (error) {
        console.error('Dev.to fetch error:', error.message)
    }
}

export const refreshDevtoArticlesInDBHelper = async () => {
    try {
        const articles = await fetchDevtoArticles()

        if (!articles) {
            throw new Error("Dev.to articles couldn't be fetched")
        }

        const bulkOps = articles.map((article) => {
            const {
                id,
                title,
                description,
                url,
                cover_image,
                published_at,
                tag_list,
                reading_time_minutes,
                user = {},
            } = article

            const { name, username, user_id, profile_image } = user

            return {
                updateOne: {
                    filter: { sourceId: id.toString() },
                    update: {
                        $set: {
                            title,
                            description,
                            url,
                            cover_img: cover_image,
                            published_at: new Date(published_at),
                            tags: tag_list,
                            reading_time_minutes,
                            author: {
                                name,
                                username,
                                user_id,
                                profile_image,
                            },
                        },
                        $setOnInsert: {
                            source: 'devto',
                            sourceId: id.toString(),
                        },
                    },
                    upsert: true,
                },
            }
        })

        await ArticleModel.bulkWrite(bulkOps)

        return { success: true, count: bulkOps.length, error: null }
    } catch (error) {
        return { success: false, error }
    }
}
