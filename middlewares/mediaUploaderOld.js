import multer from 'multer';
import path from 'path';
import sharp from 'sharp';
import fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image and video files are allowed!'), false);
  }
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(path.resolve(), file.mimetype.startsWith('image/')? './public/media/images': './public/media/videos');
    
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});


const mediaUploader = multer({fileFilter,storage});

const processImages = async (files) => {
  if (!files || files.length === 0) {
    return [];
  }

  const processedImages = await Promise.all(
    files.map(async (file) => {
      const outputFilePath = path.join(path.resolve(), 'public/media/images', `compressed-${file.filename}`);
      
      await sharp(file.path)
        .resize(300)
        .jpeg({quality:60}) 
        .toFile(outputFilePath);

      fs.unlinkSync(file.path); 

      return { url: `./public/media/images/${path.basename(outputFilePath)}` };
    })
  );

  return processedImages;
};

const processVideos = async (files) => {
  if (!files || files.length === 0) {
    return [];
  }

  const processedVideos = await Promise.all(
    files.map((file) => {
      return new Promise((resolve, reject) => {

        const outputFilePath = path.join(path.resolve(), 'public/media/videos', `compressed-${file.filename}`);

        ffmpeg(file.path)
          .output(outputFilePath)
          .videoCodec('libx264')
          .size('360x?')
          .on('end', () => {
            fs.unlinkSync(file.path); 
            resolve({ url: `./public/media/videos/${path.basename(outputFilePath)}` });
          })
          .on('error', (err) => {
            reject(err);
          })
          .run();
          
      }
    );
    })
  );

  return processedVideos;
};


const mediaProcessor = async (req, res, next) => {
  try {
    
    const imageFiles = req.files.images || [];
    const videoFiles = req.files.videos || [];

    const [processedImages,processedVideos] = await Promise.all([
      
      processImages(imageFiles),
      processVideos(videoFiles)
    ]);

    req.processedFiles = {
      
      images: processedImages,
      videos: processedVideos
    };

    next();
  } catch (err) {
    next(err);
  }
};

export { mediaUploader, mediaProcessor};