const multer = require('multer');
const cloudinary = require('./cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');


const storage = new CloudinaryStorage({
    cloudinary,

    params: async (req, file) => ({
        folder: `KAT/assets/${req.body.assetType || 'general'}`,
        resource_type: 'auto',
        public_id: `${req.body.assetType || 'asset'}_${Date.now()}`,
    }),

});

const upload = multer({ 
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
});
module.exports = upload;