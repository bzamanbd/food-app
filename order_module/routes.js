import {Router} from "express"
import { createOrder,fetchOrders,fetchOrderById,deleteOrder } from "./controllers.js"
import { isAdmin, isLoggedIn } from "../middlewares/authMiddlewares.js"

const routes = Router() 

routes.post("/order",isLoggedIn,createOrder)
routes.get("/",fetchOrders)
routes.get("/order/:id",fetchOrderById)
routes.delete("/order/:id",isLoggedIn,isAdmin,deleteOrder)


export default routes