const express = require("express")
const _=require("lodash")
const router = express.Router()
const bcrypt = require('bcryptjs')
const { User } = require("../model/User")
const { userAuth } = require("../middlewares/auth")
const { access } = require("../middlewares/access")


//localhost:3000/users/register
router.post("/register",function(req,res){
    const body= _.pick(req.body,["username","email","password"]) 
    const user= new User(body)
    user.save()
    .then(function(user){
        res.send({
            user,
            notice: "Successfully registered"
        })
    })
    .catch(function(err){ 
        res.send({
            err,
            notice: "Registration failed"

        })
    })
})

//localhost:3000/users/login
router.post("/login",function(req,res){
    const body= _.pick(req.body,["email","password"])
    User.findByCredentials(body.email,body.password)
        .then(function(user){
            if(user.tokens.length<20){
                return user.generateToken()
            }else{
                res.send({notice: "Already logged in 20 times"})
            }
        })
        .then(function(token){
            res.send({token})
        })
        .catch(function(errors){
            res.send({errors})
        })
})

//localhost:3000/users/logout
router.delete("/logout",userAuth,function(req,res){
    const {user,token} = req
    User.findByIdAndUpdate(user._id,{token:[]})
    .then(function(){
        res.send("Succefully logged out")
    })
    .catch(function(err){
        res.send({
            err,
            notice: "Invalid token"
        })
    })
})

module.exports= {
    userRouter: router
}

