const express= require("express")
const router= express.Router()

//admin controller
const {adminCategoryRouter}= require("../app/controllers/admin/CategoryController")
const { adminExpenseRouter }= require("../app/controllers/admin/ExpenseController")
const { adminUserRouter } = require("../app/controllers/admin/UserController")

//user controller
const {userRouter}= require("../app/controllers/UserController")
const {expenseRouter}= require("../app/controllers/ExpenseController")



//admin routes
router.use("/admin/users" , adminUserRouter)
router.use("/admin/categories" , adminCategoryRouter)
router.use("/admin/expenses" , adminExpenseRouter)

//user routes
router.use("/users" , userRouter)
router.use("/expenses" , expenseRouter)


module.exports= {
    routes: router
}