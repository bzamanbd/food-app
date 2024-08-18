import path from 'path';
import sharp from 'sharp';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs-extra'
import { fileURLToPath } from 'url';


const mediaProcessor = {
  processAndMoveMedia: async ({files, destinationDir, imgSize, imgQuality, isImage = true, videoSize}={}) => {
    const processedFiles = [];

    for (const file of files) {
        // Get the __dirname equivalent in ES modules
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);

        // Adjust '..' based on directory structure
        const projectRoot = path.resolve(__dirname, '..');
        
        // Navigate to the public folder
        const outputDir = path.join(projectRoot, './public/foods', destinationDir);

        fs.ensureDirSync(outputDir);

        // Ensure that outputFilePath includes the filename, not just the directory
        const outputFilePath = path.join(outputDir, path.basename(file.path));
      
        try {
            if (isImage) {
            // Process image using sharp
            await sharp(file.path)
                .resize(imgSize) // Example resize, can be adjusted or omitted
                .jpeg({quality:imgQuality})
                .toFile(outputFilePath);
            } else {
            // Process video using ffmpeg
            await new Promise((resolve, reject) => {
                ffmpeg(file.path)
                .size(`${videoSize}x?`)
                .output(outputFilePath)
                .on('end', resolve)
                .on('error', reject)
                .run();
            });
            }
            
            processedFiles.push(outputFilePath);

        } catch (err) {
            console.error(`Error processing file: ${file.path}`, err);
            throw err;  // Re-throw to handle in the controller
        }
    }

    return processedFiles;
  },

  deleteTempFiles: async (files) => {
    try {
      for (const file of files) {
        await fs.remove(file.path);
      }
    } catch (err) {
      console.error('Error deleting temp files:', err);
    }
  }
};

export default mediaProcessor;
