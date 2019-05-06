const express= require("express")
const _= require("lodash")
const router= express.Router()

const { Category }= require("../../model/Category")

const { userAuth }= require("../../middlewares/auth")
const { userAccess }= require("../../middlewares/access")


//localhost:3000/admin/categories
router.get("/", userAuth,userAccess,function(req,res){
    Category.find()
        .then(function(categories){
            res.send(categories)
        })
        .catch(function(err){
            res.send(err)
        })
})

//localhost:3000/admin/categories
router.post("/",userAuth,userAccess,function(req,res){
    const body= _.pick(req.body,["name"])
    const category= new Category(body)
    category.save()
        .then(function(category){
            res.send(category)
        })
        .catch(function(err){
            res.send(err)
        })
})

//localhost:3000/admin/categories/:id
router.get("/:id",userAuth,userAccess,function(req,res){
    const id= req.params.id
    Category.findById(id)
        .then(function(category){
            res.send(category)
        })
        .catch(function(err){
            res.send(err)
        })
})

//localhost:3000/admin/categories/:id
router.put("/:id",userAuth,userAccess,function(req,res){
    const id= req.params.id
    const body= _.pick(req.body,["name"])
    Category.findByIdAndUpdate(id,body,{new: true, runValidators: true, context: 'query'})
        .then(function(category){
            res.send(category)
        })
        .catch(function(err){
            res.send(err)
        })
})

//localhost:3000/admin/categories/:id
router.delete("/:id",userAuth,userAccess,function(req,res){
    const id= req.params.id
    Category.findByIdAndDelete(id)
        .then(function(category){
            res.send({category})
        })
        .catch(function(err){
            res.send(err)
        })
})


module.exports= {
    adminCategoryRouter: router
}