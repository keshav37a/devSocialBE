import { v2 as cloudinary } from 'cloudinary'
import streamifier from 'streamifier'

cloudinary.config({
    secure: true,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

const streamUpload = (buffer, folderPath, fileName = String(Date.now().getTime())) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: folderPath, public_id: fileName },
            (error, result) => {
                if (result) {
                    resolve(result)
                } else {
                    reject(error)
                }
            }
        )
        streamifier.createReadStream(buffer).pipe(stream)
    })
}

export const uploadImage = async (req, _, next) => {
    try {
        if (!req.cloudinaryFolderPath || !req.file) {
            return next()
        }
        const { buffer: imageBuffer } = req.file
        const result = await streamUpload(imageBuffer, req.cloudinaryFolderPath, req.cloudinaryFileName)
        console.log(result.secure_url)
        req.user.photoUrl = result.secure_url
        next()
    } catch (err) {
        console.log(err)
        next()
    }
}

/* eslint-disable security/detect-object-injection */
export const attachParams = (params = []) => {
    return (req, _, next) => {
        params.forEach(({ key, value }) => (req[key] = value))
        next()
    }
}
