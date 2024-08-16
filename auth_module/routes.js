import {Router} from "express"
import {signup,signin} from "./controllers.js"
import rateLimiter from "../utils/rateLimiter.js"
import imageUploader from "../middlewares/imageUploader.js";


const routes = Router() 

const avatarUploader = imageUploader('avatar');

routes.post("/signup", rateLimiter, avatarUploader, signup)

routes.post("/signin",signin)


export default routes