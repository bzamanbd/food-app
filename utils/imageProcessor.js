import sharp from 'sharp'
import path from 'path'
import fs from 'fs'


export const processImage = async ({ inputPath, outputDir, imgWidth,imgQuality }) => {
    // Create the folder if it doesn't exist
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const date = new Date()

    const filename = `compressed-${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}-${Math.round(Math.random() * 1E9)}.jpeg`;

    const outputPath = path.join(outputDir, filename);

    try {
        await sharp(inputPath)
        .resize(imgWidth)
        .toFormat('jpeg')
        .jpeg({ quality:imgQuality })
        .toFile(outputPath);
        
        return filename; // Return the filename to save it to the user model
    } catch (err) {
        throw new Error('Image processing failed',err);
    }
};


// Deletes a file from the filesystem.
export const deleteFile = (filePath) => {
  try {
    fs.unlinkSync(filePath); // Remove the file
  } catch (error) {
    console.error('Failed to delete file:', error);
  }
};

// export default { processImage, deleteFile };
