import { Command } from 'commander'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import {} from 'dotenv/config'
import express from 'express'

import { authRoutes } from '#Routes/authRoutes'
import { connectionRequestRoutes } from '#Routes/connectionRequestRoutes'
import { profileRoutes } from '#Routes/profileRoutes'
import { userRoutes } from '#Routes/userRoutes'

import { logger } from '#Middlewares/logger'

import { handleDBConnect } from '#Config/database'
import { EXPRESS_PORT, FRONTEND_DEV_URL, FRONTEND_PROD_URL } from '#Config/keys'

const program = new Command()

program.option('-e, --env <mode>', 'set environment').parse(process.argv)

const arguementData = program.opts()
const isProd = arguementData.env === 'prod'

const app = express()

handleDBConnect()
    .then(() =>
        app.listen(EXPRESS_PORT, () => {
            console.log(`${isProd ? 'Prod env: ' : 'Dev env: '}listening on port ${EXPRESS_PORT}`)
        })
    )
    .catch((err) => {
        console.log(`error in connecting to db ${err}`)
    })

app.use(express.json({ limit: '50mb' }))
app.use(
    express.urlencoded({
        limit: '50mb',
        extended: true,
    })
)
app.use(cookieParser())

app.use(
    cors({
        origin: isProd ? FRONTEND_PROD_URL : FRONTEND_DEV_URL,
        optionsSuccessStatus: 200,
        credentials: true,
    })
)

app.use('*', logger)

app.use('/auth', authRoutes)
app.use('/profile', profileRoutes)
app.use('/connection-request', connectionRequestRoutes)
app.use('/user', userRoutes)
