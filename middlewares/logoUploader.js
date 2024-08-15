import multer from 'multer'
import sharp from 'sharp'
import path from 'path'
import fs from 'fs'

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith('image/')) {
    return cb(new Error('Please upload only images'), false)
  }
  cb(null, true);
}
const limits = {
  fileSize: 10 * 1024 * 1024,
  files: 1, 
  fields: 20,
  parts: 30, 
  headerPairs: 2000
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(path.resolve(), 'public/avatar'))
  },
  filename: (req, file, cb) => {
    cb(null, `${file.originalname}`)
  }
});

const logoUploader = multer({fileFilter,storage}).single('logo')

const logoProcessor = async(req, res, next)=>{ 
  if (!req.file) {
    return next()
  }
  const outputFilePath = path.join(path.resolve(), 'public/logo', `${Date.now()}-compressed-${req.file.filename}`);
  try {
    await sharp(req.file.path)
    .resize(100)
    .jpeg({quality:80}) 
    .toFile(outputFilePath);
  
    fs.unlinkSync(req.file.path);
    req.processedLogo = `public/logo/${path.basename(outputFilePath)}`
    console.log('Success: logo is compressed');
    next();
  } catch (error) {
    console.log('Error: got error of logo');
    next(error);
  }

}

export  {logoUploader, logoProcessor}