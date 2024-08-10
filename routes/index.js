import { Router } from "express" 
import authRoutes from '../auth_module/routes.js'
import usersRoutes from '../user_module/routes.js'

const router = Router()

router.use("/api/v1/auth", authRoutes)
router.use("/api/v1/users", usersRoutes)
// router.use("/api/shop-owner", shopOwnerRoutes)
// router.use("/api/salesman", salesmanRoutes)
// router.use("/api/categories", categoryRoutes)
// router.use("/api/products", productRoutes)
// router.use("/api/sales", salesRoutes)
// router.use("/api/reports", salesReports)
// router.use("/api/reports", inventoryReports)
// router.use("/api/reports", profitReports)

export default router