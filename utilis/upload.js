
const multer = require('multer');
// Use memory storage to temporarily hold the files
const storage = multer.memoryStorage();

// File filter to validate image MIME type
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true); // Accept file
    } else {
        cb(new Error('Unsupported file type! Only images are allowed.'), false); // Reject file
    }
};

// Configure multer
const upload = multer({
    storage: storage, // Store files temporarily in memory
    fileFilter: fileFilter,
});


module.exports = upload;
