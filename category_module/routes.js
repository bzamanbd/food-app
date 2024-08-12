import {Router} from "express"
import { isLoggedIn } from "../middlewares/isLoggedIn.js"
import {createCategory,fetchCategories,fetchCategoryById,updatCategory,deleteCategory} from "./controllers.js"


const routes = Router() 


routes.post("/category",isLoggedIn,createCategory)
routes.get("/",fetchCategories)
routes.get("/category/:id",fetchCategoryById)
routes.put("/category/:id",isLoggedIn,updatCategory)
routes.delete("/category/:id",isLoggedIn,deleteCategory)


export default routes