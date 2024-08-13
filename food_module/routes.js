import {Router} from "express"
import { isLoggedIn } from "../middlewares/isLoggedIn.js"
import {createFood,fetchFoods,fetchFoodById,updatFood,deleteFood} from "./controllers.js"

const routes = Router() 

routes.post("/food",isLoggedIn,createFood)
routes.get("/",fetchFoods)
routes.get("/food/:id",fetchFoodById)
routes.put("/food/:id",isLoggedIn,updatFood)
routes.delete("/food/:id",isLoggedIn,deleteFood)

export default routes