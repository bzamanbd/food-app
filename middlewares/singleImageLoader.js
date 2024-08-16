import multer from 'multer'
import sharp from 'sharp'
import path from 'path'
import fs from 'fs'

// Middleware that accepts parameters when it's userd in a route
export const createImageLoader = () => {

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

  return (folderName,keyName,size,quality) => {
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        const uploadPath = path.join(path.resolve(), `public/${folderName}`)

        // Create the folder if it doesn't exist
        if (!fs.existsSync(uploadPath)) {
          fs.mkdirSync(uploadPath, { recursive: true });
        }

        cb(null, uploadPath);
      },

      filename: (req, file, cb) => {
        cb(null, `${file.originalname}`)
      }
    });

    const upload = multer({ fileFilter,limits,storage });

    return(req,res,next)=>{ 

      const uploadSingle = upload.single(`${keyName}`);
      
      uploadSingle(req, res, async (err) =>{ 

        if(err)return res.status(400).json({ error: 'Error uploading file' });
        if(!req.file)return res.status(400).json({ error: 'No file uploaded' });

        const outputFilePath = path.join(path.resolve(), `public/${folderName}`, `${Date.now()}-compressed-${req.file.filename}`);

        try {

          await sharp(req.file.path)
          .resize(size)
          .jpeg({quality:quality}) 
          .toFile(outputFilePath);

          fs.unlinkSync(req.file.path);
          req.processedImage = `public/${folderName}/${path.basename(outputFilePath)}`
          console.log('Success: avatar is compressed');
          next();
        } catch (error) {
          return res.status(500).json({ error: 'Error processing the image' });
          
        }
        
      })

    }
  };
};
