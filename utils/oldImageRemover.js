
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