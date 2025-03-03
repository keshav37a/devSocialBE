const mongoose = require('mongoose');
const { DATABASE_NAME, CONNECTION_URI } = require('./keys');

const handleDBConnect = async () => {
    try {
        console.log('handleMongoConnect called ');
        await mongoose.connect(`${CONNECTION_URI}/${DATABASE_NAME}`);
    } catch (err) {
        console.log(`err in connection to db: ${err}`);
    }
};

mongoose.connection.on('error', (err) => {
    console.error('error in connecting to mongodb: ', err);
});

mongoose.connection.once('open', () => {
    console.log('database connected');
});

module.exports = {
    handleDBConnect,
};
