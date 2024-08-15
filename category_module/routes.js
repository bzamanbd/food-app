import {Router} from "express"
import { isLoggedIn } from "../middlewares/isLoggedIn.js"
import {createCategory,fetchCategories,fetchCategoryById,updatCategory,deleteCategory} from "./controllers.js"
import { isAdmin } from "../middlewares/isAdmin.js"


const routes = Router() 


routes.post("/category",isLoggedIn,isAdmin,createCategory)
routes.get("/",fetchCategories)
routes.get("/category/:id",fetchCategoryById)
routes.put("/category/:id",isLoggedIn,isAdmin,updatCategory)
routes.delete("/category/:id",isLoggedIn,isAdmin,deleteCategory)


export default routes