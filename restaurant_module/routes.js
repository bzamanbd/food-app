import {Router} from "express"
import { isLoggedIn } from "../middlewares/isLoggedIn.js"
import {createRestaurant,fetchRestaurents,fetchRestaurentById,deleteRestaurent} from "./controllers.js"
import { isAdmin } from '../middlewares/isAdmin.js';
import { logoUploader, logoProcessor} from "../middlewares/logoUploader.js";



const routes = Router() 

routes.post("/",isLoggedIn,isAdmin,logoUploader,logoProcessor,createRestaurant)
routes.get("/",fetchRestaurents)
routes.get("/:id",fetchRestaurentById)
routes.delete("/:id",isLoggedIn,deleteRestaurent)


export default routes