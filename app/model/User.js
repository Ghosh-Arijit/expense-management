const mongoose = require('mongoose')


const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const uniqueValidator = require('mongoose-unique-validator')

//Schema
const Schema = mongoose.Schema

const userSchema = new Schema({
    username: {
        type: String,
        minlength: [4, 'username must be more then 4 character' ],
        unique: true,
        required: [true, 'username is required']
    },
    email : {
        type: String,
        unique: true,
        required: [true, 'email address is required'],
        validate: {
            validator: function(value){
                return validator.isEmail(value)
            },
            message: function(){
                return "Email is invalid"
            }
        }
    },
    password: {
        type: String,
        minlength: [6, 'password should be more than 6 characters'],
        maxlength: [128,'password should be less than 128 characters'],
        required: [true,'password is required']
    },
    tokens: [
        {
            token: {
                type: String
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ],
    roles : {
        type: [String],
        default: "employee"
    },
    allowAccess: {
        type: Boolean,
        default: true
    }
})

userSchema.plugin(uniqueValidator,{ message: '{PATH} already exists'})

//pre hooks - before saving
userSchema.pre("save",function(next){
    const user = this
    if(user.isNew){
        function encryptPassword(){
            return bcrypt.genSalt(10)
                .then(function(salt){
                    return bcrypt.hash(user.password,salt)
                    .then(function(encPass){
                        user.password= encPass
                    })
                })
        }
        function setRole(){
            return User.countDocuments()
            .then(function(count){
                if(count == 0){
                    user.roles = ["admin"]
                }
            })
        }
        return Promise.all([encryptPassword(),setRole()])
        .then(function(value){
            next()
        })
        .catch(function(err){
            return Promise.reject(err.message)
        })
    }else{
        next()
    }
})

//static methods
userSchema.statics.findByCredentials = function(email,password) {
    const User = this
    return User.findOne({$or:[{email:email},{username:email}]})
            .then(function(user){
                if(!user){
                    return Promise.reject("invalid email/username")
                }
                else{
                    return bcrypt.compare(password,user.password)
                        .then(function(result){
                            if(!result){
                                return Promise.reject("invalid email/password")
                            }else{                                
                                if(user.allowAccess){
                                    return Promise.resolve(user)
                                }else{
                                    return Promise.reject("access denied")
                                }
                            }
                        })
                }                
            })
            .catch(function(err){
                return Promise.reject(err)
            })
}

//static method
userSchema.statics.findByToken = function(token){
    const User = this
    let tokenData 
    try{
        tokenData = jwt.verify(token,"jwt@123")
    }catch(err){
        return Promise.reject(err)
    }
    return User.findOne({
        _id: tokenData._id,
        "tokens.token" : token
    })
}

//instance methods
userSchema.methods.generateToken = function() {
    const user = this
    const tokenData = {
        _id: user._id,
        username: user.username,
        createdAt: Number(new Date())
    }
    const token = jwt.sign(tokenData,"jwt@123")
    user.tokens.push({
        token
    })
    return user.save()
    .then(function(user){
        return Promise.resolve(token)
    })
    .catch(function(err){
        return Promise.reject(err)
    })
}

const User = mongoose.model("User",userSchema)

module.exports = {
    User
}