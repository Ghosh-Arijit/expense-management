const express= require("express")
const _= require("lodash")
const router= express.Router()

const{ User }= require("../../model/User")

const { userAuth }= require("../../middlewares/auth")
const { userAccess }= require("../../middlewares/access")

//localhost:3000/admin/users
router.get("/",userAuth,userAccess,function(req,res){
    User.find()
        .then(function(users){
            res.send(users)
        })
        .catch(function(err){
            res.send(err)
        })
})

//localhost:3000/admin/users/:id
router.get("/:id",userAuth,userAccess,function(req,res){
    const id= req.params.id
    User.findById(id)
        .then(function(users){
            res.send(users)
        })
        .catch(function(err){
            res.send(err)
        })
})

//localhost:3000/admin/users
router.post("/",userAuth,userAccess,function(req,res){
    const body=  _.pick(req.body,["username","email","password","roles","allowAccess"])
    const user= new User(body)
    user.save()
        .then(function(users){
            res.send(user)
        })
        .catch(function(err){
            res.send(err)
        })
})

//localhost:3000/admin/users/:id
router.put("/:id",userAuth,userAccess,function(req,res){
    const id = req.params.id
    const body = _.pick(req.body,["username", "email", "password", "roles", "allowAccess"])
    User.findByIdAndUpdate(id, body, {new: true, runValidators: true, context: 'query'})
        .then(function(user){
            res.send(user)
    })
        .catch(function(errors){
            res.send(errors)
    })
})


//localhost:3000/admin/users/:id
router.delete("/:id",userAuth,userAccess,function(req,res){
    const id = req.params.id
    User.findByIdAndDelete(id)
        .then(function(user){
            res.send(user)
        })
        .catch(function(err){
            res.send(err)
        })
})


module.exports= {
    adminUserRouter: router
}

