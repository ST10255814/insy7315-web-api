/*
Reference followed:
OsmaniDev. 2023. How to upload images to Cloudinary with Multer and Express.js. [video online] 
Available at: <https://youtu.be/3Gj_mL9JJ6k?si=QhX71a3Fdf7SNxpr> [Accessed 2 September 2025].
*/

import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'listings', // folder in Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [{ width: 800, height: 800, crop: "limit" }], // optional
  },
});

const upload = multer({ storage });

export {
   cloudinary, 
   upload
};
