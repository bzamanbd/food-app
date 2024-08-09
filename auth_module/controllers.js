import appErr from "../utils/appErr.js"
import bcrypt from "bcryptjs"
import jwt from 'jsonwebtoken'
import 'dotenv/config'
import appRes from "../utils/appRes.js"


export const signup = async(req, res,next)=>{ 
    const {name,email,password} = req.body
    if(!name || !email || !password) return next(appErr('name, email and password are required'),400) 
    const hashedPass = await bcrypt.hash(password, 10) 
    try { 
        const oldEmail = await prisma.user.findUnique({where:{email}})

        if (oldEmail) return next(appErr('user already exist!. name and email should be unique ',401))
        
        
        const user = await prisma.user.create({
            data:{name,email,password:hashedPass,role:'SUPERADMIN'}
        })
        user.password = undefined
        appRes(res,201,'','Registration success',{user})
    } catch (e) {
        return next(appErr(e.message,500))
    }
}

export const signin = async(req,res, next)=>{ 
    const {email,password} = req.body
    if(!email || !password) return next(appErr('email and password are required'),400) 
    try {
        const user = await prisma.user.findUnique({ where:{email}})
        if (user && bcrypt.compare(password, user.password)) {

            const tocken = jwt.sign({id:user.id, email:user.email},process.env.JWT_SECRET,{expiresIn: '30m'}) 

            appRes(res,200,'','Login success!',{tocken})
        }
        return next(appErr('wrong credential!',401))
    } catch (e) {
        return next(appErr(e.message,500))
    } 

}
