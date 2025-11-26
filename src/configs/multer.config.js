'use strict'
const multer = require('multer');
const uploadMemory = multer({ storage: multer.memoryStorage() });
const storageDisk = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './src/upload/')
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})
const uploadDisk = multer({ storage: storageDisk });
module.exports = {
    uploadMemory,
    uploadDisk
};
