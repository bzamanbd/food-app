import {Router} from "express"
import {createCategory,fetchCategories,fetchCategoryById,updatCategory,deleteCategory} from "./controllers.js"
import { isAdmin, isLoggedIn } from "../middlewares/authMiddlewares.js"
import imageUploader from "../middlewares/imageUploader.js";

const routes = Router() 
const categoryImageUploader = imageUploader('image');

routes.post("/category",isLoggedIn,isAdmin,categoryImageUploader,createCategory)
routes.get("/",fetchCategories)
routes.get("/category/:id",fetchCategoryById)
routes.put("/category/:id",isLoggedIn,isAdmin,categoryImageUploader,updatCategory)
routes.delete("/category/:id",isLoggedIn,isAdmin,deleteCategory)

export default routes