import {Router} from "express"
import {createRestaurant,fetchRestaurents,fetchRestaurentById,deleteRestaurent} from "./controllers.js"
import { isAdmin, isLoggedIn } from "../middlewares/authMiddlewares.js";
import imageUploader from "../middlewares/imageUploader.js";



const routes = Router()
const logoUploader = imageUploader('logo');

routes.post("/",isLoggedIn,isAdmin,logoUploader,createRestaurant)
routes.get("/",fetchRestaurents)
routes.get("/:id",fetchRestaurentById)
routes.delete("/:id",isLoggedIn,isAdmin,deleteRestaurent)


export default routes