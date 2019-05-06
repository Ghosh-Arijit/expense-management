const mongoose = require("mongoose")
const uniqueValidator = require('mongoose-unique-validator')

 const Schema = mongoose.Schema
 const categorySchema = new Schema({
     name : {
         type: String,
         required: [true, 'name is required'],
         unique: true 
     }
 })
 categorySchema.plugin(uniqueValidator, { message: '{PATH} already exists' })

 const Category = mongoose.model("Category",categorySchema)
 module.exports ={
     Category
 }