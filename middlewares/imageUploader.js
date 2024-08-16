import multer from 'multer'
import fs from 'fs'

// Create temporary directory if it does not exist
const TEMP_DIR = './temp';
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR);
};

const fileFilter = (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Please upload only images'), false)
    }
    cb(null, true);
};

const limits = {
    fileSize: 10 * 1024 * 1024,
    files: 1, 
    fields: 20,
    parts: 30, 
    headerPairs: 2000
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, TEMP_DIR);
  },
  filename: (req, file, cb) => {
    const filename = `img-${Date.now()}-${Math.round(Math.random() * 1E9)}.jpeg`;
    cb(null, filename);
  },
});

const upload = multer({ storage,fileFilter,limits });

function imageUploader(keyName) {
  return (req, res, next) => {
    upload.single(`${keyName}`)(req, res, (err) => {
      if (err) {
        return next(err);
      }
      next();
    });
  };
}

export default imageUploader;
