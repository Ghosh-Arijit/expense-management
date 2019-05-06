const express= require("express")
const _=require("lodash")

const router= express.Router()

const { Expense } = require('../model/Expense')
const {userAuth}= require("../middlewares/auth")


//multer
const multer  = require('multer')
const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null, "uploads")
    },
    filename: function(req,file,cb){
        cb(null, Number(new Date()) + '_' + file.originalname)
    }
})

const fileFilter = (req,file,cb) => {
    if(file.mimetype == 'image/jpeg' || file.mimetype == 'image/png'){
        cb(null,true)
    }else{
        cb(null,false)
    }
}

const upload = multer({
    storage, 
    limits: { fileSize: 1024 * 1024 * 5 },
    fileFilter
})

//localhost:3000/expences
router.get("/",userAuth,function(req,res){
    Expense.find({"colleagues.user" : req.user._id})
    .populate('user','username')
    .populate('category','name')
    .populate('colleagues.user','username')
    .then(function(expenses){
        console.log(expenses)
        res.send(expenses)
    })
    .catch(function(error){
        res.send({error})
    })
})

//localhost:3000/expences
router.post('/',userAuth,function(req,res){
    const body=_.pick(req.body,["category","reason","colleagues"])
    body.user=req.user._id
    const expense= new Expense(body)
    expense.save()
    .then(function(user){
        res.send({
            expense,
            notice: "Successfully inserted"
        })
    })
    .catch(function(err){
        res.send({
            err,
            notice: "Failed to insert"
        })
    })
})

//localhost:3000/expenses/:id
router.get('/:id',userAuth,function(req,res) {
    const id = req.params.id
    Expense.findOne({"colleagues.user": req.user._id, _id: id})
    .populate('user','username')
    .populate('category','name')
    .populate('colleagues','username')
    .then(function(expense){
        if(expense) {
            res.send(expense)
        } else{
            res.send('404').send({})
        }
    })
    .catch(function(err){
        res.send(err)
    })
})

//localhost:3005/expenses/:id
router.put("/:id", userAuth, upload.single("receipt"), function(req,res){
    const id = req.params.id
    const body = _.pick(req.body,["amountSpent","receipt"])
    if(req.file){
        body.receipt = req.file.filename
    }
    Expense.findOneAndUpdate({
            _id: id,
            "colleagues.user": req.user._id
        }, { $set: { 
            "colleagues.$.amountSpent": body.amountSpent,
            "colleagues.$.receipt": body.receipt
        }}, {new: true, runValidators: true})
        .then(function(expense){
            res.send(expense)
        })
        .catch(function(err){
            res.send(err)
        })
})


module.exports = {
    expenseRouter: router 
}