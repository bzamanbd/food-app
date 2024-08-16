import {Router} from "express"
import {createRestaurant,fetchRestaurents,fetchRestaurentById,deleteRestaurent} from "./controllers.js"
import { logoUploader, logoProcessor} from "../middlewares/logoUploader.js";
import { isAdmin, isLoggedIn } from "../middlewares/authMiddlewares.js";



const routes = Router() 

routes.post("/",isLoggedIn,isAdmin,logoUploader,logoProcessor,createRestaurant)
routes.get("/",fetchRestaurents)
routes.get("/:id",fetchRestaurentById)
routes.delete("/:id",isLoggedIn,isAdmin,deleteRestaurent)


export default routes