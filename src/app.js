const dotenv = require('dotenv');
const express = require('express');

dotenv.config();
const { handleDBConnect } = require('./config/database');

const EXPRESS_PORT = 7777;
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

app.use('/test', (req, res) => {
    res.send('hello from the server');
});
