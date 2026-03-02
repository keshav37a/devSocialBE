import { Command } from 'commander'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import {} from 'dotenv/config'
import express from 'express'

import { authRoutes } from '#Routes/authRoutes'
import { chatMessageRoutes } from '#Routes/chatRoutes'
import { connectionRequestRoutes } from '#Routes/connectionRequestRoutes'
import { profileRoutes } from '#Routes/profileRoutes'
import { userRoutes } from '#Routes/userRoutes'

import { logger } from '#Middlewares/logger'

import { initializeSocket } from '#Utils/socket'

import { handleDBConnect } from '#Config/database'
import { EXPRESS_PORT, FRONTEND_DEV_URL, FRONTEND_PROD_URL } from '#Config/keys'

const program = new Command()

program.option('-e, --env <mode>', 'set environment').parse(process.argv)

const arguementData = program.opts()
const isProd = arguementData.env === 'prod'

const expressServer = express()
const socketAndExpressServer = initializeSocket(expressServer, isProd)

handleDBConnect()
    .then(() =>
        socketAndExpressServer.listen(EXPRESS_PORT, () => {
            console.log(`${isProd ? 'Prod env: ' : 'Dev env: '}listening on port ${EXPRESS_PORT}`)
        })
    )
    .catch((err) => {
        console.log(`error in connecting to db ${err}`)
    })

expressServer.use(express.json({ limit: '50mb' }))
expressServer.use(
    express.urlencoded({
        limit: '50mb',
        extended: true,
    })
)
expressServer.use(cookieParser())

expressServer.use(
    cors({
        origin: isProd ? FRONTEND_PROD_URL : FRONTEND_DEV_URL,
        optionsSuccessStatus: 200,
        credentials: true,
    })
)

expressServer.use('*', logger)

expressServer.use('/api/auth', authRoutes)
expressServer.use('/api/chat', chatMessageRoutes)
expressServer.use('/api/connection-request', connectionRequestRoutes)
expressServer.use('/api/profile', profileRoutes)
expressServer.use('/api/user', userRoutes)
