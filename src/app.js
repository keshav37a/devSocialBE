require('dotenv').config();
const cookieParser = require('cookie-parser');
const express = require('express');
const { handleDBConnect } = require('./config/database');
const { userRoutes } = require('./routes/userRoutes');
const { EXPRESS_PORT } = require('./config/keys');

const app = express();

handleDBConnect()
    .then(() => {
        app.listen(EXPRESS_PORT, () => {
            console.log(`listening on port ${EXPRESS_PORT}`);
        });
    })
    .catch((err) => {
        console.log(`error in connecting to db ${err}`);
    });

app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);
app.use(cookieParser());

app.use('/user', userRoutes);
