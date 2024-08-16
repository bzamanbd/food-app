import {Router} from "express"
import {createFood,fetchFoods,fetchFoodsByRestaurantId,fetchFoodById,updatFood,deleteFood} from "./controllers.js"
import { isAdmin, isLoggedIn } from "../middlewares/authMiddlewares.js"
import { mediaUploader, mediaProcessor } from "../middlewares/mediaUploader.js"


const routes = Router() 

routes.post("/food",isLoggedIn,isAdmin,mediaUploader.fields([{'name':'images',maxCount:3},{'name':'videos',maxCount:1}]),mediaProcessor,createFood)
routes.get("/",fetchFoods)
routes.get("/:id",fetchFoodsByRestaurantId)
routes.get("/food/:id",fetchFoodById)
routes.put("/food/:id",isLoggedIn,updatFood)
routes.delete("/food/:id",isLoggedIn,deleteFood)

export default routes