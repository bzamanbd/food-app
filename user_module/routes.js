import {Router} from "express"
import { isLoggedIn } from "../middlewares/isLoggedIn.js"
import {fetchUsers,fetchProfile,updateProfile,fetchQuestion,resetPassword} from "./controllers.js"


const routes = Router() 

routes.get("/", isLoggedIn, fetchUsers)
routes.get("/user/profile", isLoggedIn, fetchProfile)
routes.put("/user/update", isLoggedIn, updateProfile)
routes.get("/user/question",  fetchQuestion)
routes.post("/user/reset-password",resetPassword)


export default routes