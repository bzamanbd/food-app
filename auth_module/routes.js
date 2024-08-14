import {Router} from "express"
import {signup,signin} from "./controllers.js"
import rateLimiter from "../utils/rateLimiter.js"


const routes = Router() 

routes.post("/signup",rateLimiter,signup)
routes.post("/signin",rateLimiter,signin)


export default routes