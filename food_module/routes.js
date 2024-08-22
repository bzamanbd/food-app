import {Router} from "express"
import {createFood,fetchFoods,fetchFoodsByRestaurantId,fetchFoodById,editFood,deleteFood} from "./controllers.js"
import { isAdmin, isLoggedIn } from "../middlewares/authMiddlewares.js"
import mediaUploader from '../middlewares/mediaUploader.js'


const routes = Router()
const foodMediaUploader =  mediaUploader.fields([{name:'images',maxCount:3},{name:'videos',maxCount:1}])

routes.post("/food",isLoggedIn,isAdmin,foodMediaUploader,createFood)
routes.get("/",fetchFoods)
routes.get("/:id",fetchFoodsByRestaurantId)
routes.get("/food/:id",fetchFoodById)
routes.put("/food/:id",isLoggedIn,isAdmin,foodMediaUploader,editFood)
routes.delete("/food/:id",isLoggedIn,deleteFood)

export default routes