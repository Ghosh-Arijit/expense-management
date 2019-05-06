const express= require("express")
const _= require("lodash")
const router= express.Router()

const { Expense }= require("../../model/Expense")

const { userAuth }= require("../../middlewares/auth")
const { userAccess }= require("../../middlewares/access")


//localhost:3000/admin/expenses
router.get("/",userAuth,userAccess,function(req,res){
    Expense.find()
           .populate('user' , 'username')
           .populate('category' , 'name')
           .populate('colleagues.user' , 'username')
        .then(function(expenses){
            res.send(expenses)
        })
        .catch(function(err){
            res.send(err)
        })

})

//localhost:3000/admin/expenses
router.post("/",userAuth,userAccess,function(req,res){
    const body= _.pick(req.body,["user","budget","category","reason","colleagues"])
    const expense= new Expense(body)
    expense.save()
        .then(function(expense){
            res.send(expense)
        })
        .catch(function(err){
            res.send(err)
        })
})

////localhost:3000/admin/expenses/:id
router.get(":/id",userAuth,userAccess,function(req,res){
    const id= req.params.id
    Expense.findById(id)
           .populate('user' , 'username')
           .populate('category','name')
           .populate('colleagues.user' , 'username')
        .then(function(expense){
            res.send(expense)
        })
        .catch(function(err){
            res.send(err)
        })
})

//localhost:3000/admin/expenses/:id
router.put("/:id",userAuth,userAccess,function(req,res){
    const id= req.params.id
    const body= _.pick(req.body,['user','budget','category','reason','colleagues','isApproved'])
    Expense.findByIdAndUpdate(id,body,{new: true, runValidators: true})
        .then(function(expense){
            res.send(expense)
        })
        .catch(function(err){
            res.send(err)
        })
})
//localhost:3000/admin/expenses/:id
router.delete("/:id",userAuth,userAccess,function(req,res){
    const id= req.params.id
    Expense.findByIdAndDelete(id)
        .then(function(expense){
            res.send({expense})
        })
        .catch(function(err){
            res.send(err)
        })
})


module.exports= {
    adminExpenseRouter: router
}