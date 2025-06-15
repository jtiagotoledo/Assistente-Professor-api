const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: 'uploads/tmp/', // salva temporariamente
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname.replace(/\s/g, '_');
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

module.exports = upload;
