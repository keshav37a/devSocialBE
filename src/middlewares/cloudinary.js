import streamifier from 'streamifier'

import { cloudinary } from '#Config/cloudinary'

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
