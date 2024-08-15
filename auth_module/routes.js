import {Router} from "express"
import {signup,signin} from "./controllers.js"
import rateLimiter from "../utils/rateLimiter.js"
import { avatarProcessor, avatarUploader } from "../middlewares/avatarUploader.js"


const routes = Router() 

routes.post("/signup",rateLimiter,avatarUploader,avatarProcessor,signup)
routes.post("/signin",signin)


export default routes