'use strict'
const cloudinary = require('../configs/cloudinary.config');
//1. upload from url image
class UploadService {
    static async uploadImageFromUrl() {
        try {
            const urlImage = 'https://jbagy.me/wp-content/uploads/2025/03/Hinh-anh-doremon-cute-1.jpg'
            const folderName = 'product/shopId'
            const newFileName = 'image-name'
            const result = await cloudinary.uploader.upload(urlImage, {
                folder: folderName,
                public_id: newFileName,
            })
            console.log(result);
        } catch (err) {
            console.error('Error uploading image from URL:', err);
        }
    }
    static async uploadImageFromLocal({path, folderName = 'product/1902'}) {
        try {
            const result = await cloudinary.uploader.upload(path, {
                folder: folderName,
                public_id: 'thumb',
            })
            console.log(result);
            return {
                image_url: result.secure_url,
                shopId: '1902',
                thumb_url: await cloudinary.url(result.public_id, {
                    width: 200,
                    height: 200,
                    crop: 'fill',
                }),
            }
        } catch (err) {
            console.error('Error uploading image from URL:', err);
        }
    }
}
module.exports = UploadService;
