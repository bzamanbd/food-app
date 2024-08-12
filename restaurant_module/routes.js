import {Router} from "express"
import { isLoggedIn } from "../middlewares/isLoggedIn.js"
import {createRestaurant,fetchRestaurents,fetchRestaurentById,deleteRestaurent} from "./controllers.js"


const routes = Router() 


routes.post("/create",isLoggedIn,createRestaurant)
routes.get("/",fetchRestaurents)
routes.get("/:id",fetchRestaurentById)
routes.delete("/:id",isLoggedIn,deleteRestaurent)


export default routes