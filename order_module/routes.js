import {Router} from "express"
import { isLoggedIn } from "../middlewares/isLoggedIn.js"
import { createOrder,fetchOrders,fetchOrderById,deleteOrder } from "./controllers.js"


const routes = Router() 


routes.post("/order",isLoggedIn,createOrder)
routes.get("/",fetchOrders)
routes.get("/order/:id",fetchOrderById)
routes.delete("/order/:id",isLoggedIn,deleteOrder)


export default routes