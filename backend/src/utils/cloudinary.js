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

//configure Multer storage for Cloudinary
const pfpStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'profilePicture', // folder in Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [{ width: 800, height: 800, crop: "limit" }], // optional
  },
});

// Configure dynamic Multer storage for Cloudinary
const dynamicStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const isImage = file.mimetype.startsWith("image/");
    return {
      folder: isImage ? "BookingImages" : "bookingFiles",
      resource_type: isImage ? "image" : "raw",
      allowed_formats: isImage 
        ? ["jpg", "png", "jpeg"]
        : ["pdf", "docx", "doc"],
    };
  },
});

// configure cloudinary storage
const maintenanceStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'Maintenance', // folder in Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [{ width: 800, height: 800, crop: "limit" }], // optional
  },
});

const uploadFiles = multer({ storage: dynamicStorage });
const maintenanceUpload = multer({ storage: maintenanceStorage })
const upload = multer({ storage });
const pfpUpload = multer({storage: pfpStorage});

export {
   cloudinary, 
   upload,
   uploadFiles,
   maintenanceUpload,
   pfpUpload
};
