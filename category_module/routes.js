import {Router} from "express"
import {createCategory,fetchCategories,fetchCategoryById,updatCategory,deleteCategory} from "./controllers.js"
import { isAdmin, isLoggedIn } from "../middlewares/authMiddlewares.js"
import { createImageLoader } from '../middlewares/singleImageLoader.js';

const categoryImageLoader = createImageLoader();

const routes = Router() 

routes.post("/category",isLoggedIn,isAdmin,categoryImageLoader('categories','image',100,90),createCategory)
routes.get("/",fetchCategories)
routes.get("/category/:id",fetchCategoryById)
routes.put("/category/:id",isLoggedIn,isAdmin,updatCategory)
routes.delete("/category/:id",isLoggedIn,isAdmin,deleteCategory)

export default routes