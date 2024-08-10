import {Router} from "express"
import {fetchUsers,} from "./controllers.js"
import { isLoggedIn } from "../middlewares/isLoggedIn.js"


const routes = Router() 

routes.get("/", isLoggedIn, fetchUsers)


export default routes