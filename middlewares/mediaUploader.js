import multer from 'multer';
import path from 'path';
import sharp from 'sharp';
import fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(path.resolve(), 'public/media');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const mediaUploader = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image and video files are allowed!'), false);
    }
  }
});


const processImages = async (files) => {
  if (!files || files.length === 0) {
    return [];
  }

  const processedImages = await Promise.all(
    files.map(async (file) => {
      const outputFilePath = path.join(path.resolve(), 'public/media/images', `compressed-${req.file.filename}`);
      
      await sharp(req.file.path)
        .resize(300)
        .jpeg({quality:60}) 
        .toFile(outputFilePath);

      fs.unlinkSync(req.file.path); 

      return { url: `/public/media/images/${path.basename(outputFilePath)}` };
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
        const outputFilePath = path.join(path.resolve(), 'public/media/videos', `compressed-${req.file.filename}`);

        ffmpeg(req.file.path)
          .output(outputFilePath)
          .videoCodec('libx264')
          .size('360x?')
          .on('end', () => {
            fs.unlinkSync(req.file.path); 
            resolve({ url: `/public/media/videos/${path.basename(outputFilePath)}` });
          })
          .on('error', (err) => {
            reject(err);
          })
          .run();
      });
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