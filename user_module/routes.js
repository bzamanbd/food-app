import {Router} from "express"
import {fetchUsers,fetchProfile,updateProfile,fetchQuestion,resetPassword,updatePassword,deleteOwnAccount} from "./controllers.js"
import { isAdmin, isLoggedIn } from "../middlewares/authMiddlewares.js"
import imageUploader from '../middlewares/imageUploader.js';


const routes = Router() 

const avatarUploader = imageUploader('avatar');

routes.get("/", isLoggedIn, isAdmin, fetchUsers)
routes.get("/user/profile", isLoggedIn, fetchProfile)
routes.put("/user/update", isLoggedIn, avatarUploader, updateProfile)
routes.get("/user/question",  fetchQuestion)
routes.post("/user/reset-password",resetPassword)
routes.post("/user/update-password",isLoggedIn,updatePassword)
routes.delete("/user/delete-account",isLoggedIn,deleteOwnAccount)


export default routes