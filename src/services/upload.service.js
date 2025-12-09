'use strict'

const crypto = require('crypto');
require('dotenv').config();
const cloudinary = require('../configs/cloudinary.config');

//import s3 config
const cloudfrontDomain = process.env.CLOUDFRONT_DOMAIN;
const { s3, PutObjectCommand, GetObjectCommand, DeleteBucketCommand } = require('../configs/s3.config');
// const {getSignedUrl} = require('@aws-sdk/s3-request-presigner');
const { getSignedUrl } = require('@aws-sdk/cloudfront-signer');
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
    static async uploadImageFromLocal({ path, folderName = 'product/1902' }) {
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
    static async uploadImageToS3({ file }) {
        try {
            const randomImageName = crypto.randomBytes(16).toString('hex');
            const command = new PutObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: randomImageName || 'unnamed',
                Body: file.buffer,
                ContentType: 'image/jpeg'
            })
            console.log('cloudfrontDomain:', cloudfrontDomain);
            console.log('randomImageName:', randomImageName);
            console.log('PrivateKey:', process.env.CLOUDFRONT_PRIVATE_KEY);

            const result = await s3.send(command);
            console.log('Successfully uploaded image to S3:', result);
            

            const url = getSignedUrl({
                url: `${cloudfrontDomain}/${randomImageName}`,
                dateLessThan: new Date(Date.now() + 60 * 60 * 1000),
                keyPairId: process.env.CLOUDFRONT_KEY_PAIR_ID,
                privateKey: process.env.CLOUDFRONT_PRIVATE_KEY.replace(/\\n/g, '\n'),
            })
            console.log('Signed URL:', url);
            return {
                url,
                result
            }
        } catch (err) {
            console.error('Error uploading image to S3:', err);
        }
    }
}
module.exports = UploadService;
