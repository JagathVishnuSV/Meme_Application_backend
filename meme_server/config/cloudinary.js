const cloudinary = require('cloudinary').v2;  // Ensure you're using cloudinary.v2
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Multer storage configuration
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,  // Use the correct cloudinary instance here
  params: {
    folder: 'memes',  // Folder where images will be uploaded in Cloudinary
    allowedFormats: ['jpeg', 'png', 'jpg'],
  },
});

const upload = multer({ storage: storage });  // Create multer instance using CloudinaryStorage

module.exports = { upload, cloudinary };
