const cloudinary = require('cloudinary').v2;
const {CloudinaryStorage} = require('multer-storage-cloudinary');
require('dotenv').config();
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary,
    params:{

        folder: 'SNAPSYNC PHOTOS',
        allowed_formats: ['jpg','jpeg','png'],
        transformations: [{width: 1000, height: 1000, crop: "limit"}]

    }
});

module.exports = {
    cloudinary,
    storage
}

