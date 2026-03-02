import express from 'express'

import { adminAuth, userAuth } from '#Middlewares/auth'

import {
    refreshDevtoArticlesInDB,
    deleteAllArticles,
    getAllArticles,
    getDevtoArticles,
} from '#Controllers/articleController'

const router = express.Router()

/* Admin routes */
router.get('/devto/fetch', adminAuth, getDevtoArticles)
router.post('/devto/refresh', adminAuth, refreshDevtoArticlesInDB)
router.delete('/', adminAuth, deleteAllArticles)

/* Customer routes */
router.get('/', userAuth, getAllArticles)

export const articlesRoutes = router
