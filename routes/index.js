import { Router } from "express" 
import authRoutes from '../auth_module/routes.js'
import usersRoutes from '../user_module/routes.js'
import categoryRoutes from '../category_module/routes.js'
import restaurantRoutes from '../restaurant_module/routes.js'
import foodsRoutes from '../food_module/routes.js'

const router = Router()

router.use("/api/v1/auth", authRoutes)
router.use("/api/v1/users", usersRoutes)
router.use("/api/v1/restaurants", restaurantRoutes)
router.use("/api/v1/categories", categoryRoutes)
router.use("/api/v1/foods", foodsRoutes)

export default router