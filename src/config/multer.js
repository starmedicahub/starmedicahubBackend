const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});
console.log(process.env.CLOUD_NAME);

// Configure Cloudinary storage for different types of uploads
const cloudinaryStorage = (folderName) => new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: folderName,
        format: async (req, file) => {
            const extension = file.originalname.split('.').pop();
            return extension; // Set format based on original file extension
        },
        public_id: (req, file) => {
            return `${Date.now()}_${file.originalname.split('.')[0]}`; // Unique filename including original name
        },
    },
});

// Multer configuration for different types of uploads
const upload = multer({ storage: cloudinaryStorage('uploadUser') });
const dealerLogo = multer({ storage: cloudinaryStorage('uploadDealerLogo') });
const dealerDocument = multer({ storage: cloudinaryStorage('uploadDealerDocument') });
const modelImages = multer({ storage: cloudinaryStorage('modelImages') });
const vehicleDocument = multer({ storage: cloudinaryStorage('uploadVehicleDocument') });
const ServiceStationDocument = multer({ storage: cloudinaryStorage('uploadServiceStationDocument') });
const CustomerSupportDocument = multer({ storage: cloudinaryStorage('uploadCustomerSupportDocument') });
const Message = multer({ storage: cloudinaryStorage('uploadMessage') });

module.exports = { 
    upload, 
    dealerLogo, 
    dealerDocument, 
    modelImages, 
    vehicleDocument, 
    ServiceStationDocument, 
    CustomerSupportDocument, 
    Message 
};