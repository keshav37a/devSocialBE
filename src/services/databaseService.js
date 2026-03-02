import mongoose from 'mongoose'

export const handleDBConnect = async () => {
    try {
        console.log('handleMongoConnect called ')
        await mongoose.connect(`${process.env.MONGODB_CONNECTION_URI}/${process.env.DATABASE_NAME}`)
    } catch (err) {
        console.log(`err in connection to db: ${err}`)
    }
}

mongoose.connection.on('error', (err) => {
    console.error('error in connecting to mongodb: ', err)
})

mongoose.connection.once('open', () => {
    console.log('database connected')
})
