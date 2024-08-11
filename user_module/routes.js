import {Router} from "express"
import { isLoggedIn } from "../middlewares/isLoggedIn.js"
import {fetchUsers,fetchProfile,updateProfile,fetchQuestion,resetPassword,updatePassword} from "./controllers.js"


const routes = Router() 

routes.get("/", isLoggedIn, fetchUsers)
routes.get("/user/profile", isLoggedIn, fetchProfile)
routes.put("/user/update", isLoggedIn, updateProfile)
routes.get("/user/question",  fetchQuestion)
routes.post("/user/reset-password",resetPassword)
routes.post("/user/update-password",isLoggedIn,updatePassword)


export default routes