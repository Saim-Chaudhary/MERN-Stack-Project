const multer = require('multer');
const cloudinary = require('./cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');


const storage = new CloudinaryStorage({
    cloudinary,

    params: async (req, file) => ({
        folder: 'KAT/documents',
        resource_type: 'auto',
        public_id: `document_${Date.now()}`,
    }),

});

const upload = multer({ storage });
module.exports = upload;