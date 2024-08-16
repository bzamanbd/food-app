import {Router} from "express"
import {signup,signin} from "./controllers.js"
import rateLimiter from "../utils/rateLimiter.js"
import { createImageLoader } from "../middlewares/singleImageLoader.js"

const avatarLoader = createImageLoader()

const routes = Router() 

routes.post("/signup",rateLimiter,avatarLoader('avatars','avatar',80,90),signup)
routes.post("/signin",signin)


export default routes