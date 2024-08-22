
import path from "path"
import fs from 'fs'

export const oldImageRemover = ({existImage}) =>{ 
    if (fs.existsSync(existImage)) {
        if (existImage) {
            const oldLogoPath = path.join(existImage)
            fs.unlinkSync(oldLogoPath)
        }
    }
}




export const deleteFile = (filePath) => {
    fs.unlink(filePath, (err) => {
        if (err) {
            console.error(`Error deleting file: ${filePath}`, err);
        }
    });
};
