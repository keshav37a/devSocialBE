const cookieParser = require('cookie-parser')
const cors = require('cors')
require('dotenv').config()
const express = require('express')

const { handleDBConnect } = require('#Config/database')
const { EXPRESS_PORT, FRONTEND_DEV_URL } = require('#Config/keys')

const { authRoutes } = require('#Routes/authRoutes')
const { connectionRequestRoutes } = require('#Routes/connectionRequestRoutes')
const { profileRoutes } = require('#Routes/profileRoutes')
const { userRoutes } = require('#Routes/userRoutes')

const app = express()

handleDBConnect()
    .then(() =>
        app.listen(EXPRESS_PORT, () => {
            console.log(`listening on port ${EXPRESS_PORT}`)
        })
    )
    .catch((err) => {
        console.log(`error in connecting to db ${err}`)
    })

app.use(express.json())
app.use(
    express.urlencoded({
        extended: true,
    })
)
app.use(cookieParser())

app.use(
    cors({
        origin: FRONTEND_DEV_URL,
        optionsSuccessStatus: 200,
        credentials: true,
    })
)

app.use('/auth', authRoutes)
app.use('/profile', profileRoutes)
app.use('/connection-request', connectionRequestRoutes)
app.use('/user', userRoutes)
