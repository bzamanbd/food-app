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

const avatarUploader = multer({fileFilter,limits,storage}).single('avatar')

const avatarProcessor = async(req, res, next)=>{ 
  if (!req.file) {
    return next()
  }
  const outputFilePath = path.join(path.resolve(), 'public/avatar', `${Date.now()}-compressed-${req.file.filename}`);
  try {
    await sharp(req.file.path)
    .resize(100)
    .jpeg({quality:80}) 
    .toFile(outputFilePath);
  
    fs.unlinkSync(req.file.path);
    req.processedAvatar = `public/avatar/${path.basename(outputFilePath)}`
    console.log('Success: avatar is compressed');
    next();
  } catch (error) {
    console.log('Error: got error of avatar');
    next(error);
  }

}

export  {avatarUploader, avatarProcessor}