const mongoose = require('mongoose')

//Schema
const Schema = mongoose.Schema

const expenseSchema = new Schema ({
    createdAt: {
        type: String,
        default: Date.now
    },
    budget: Number,
    category: {
        type : Schema.Types.ObjectId,
        ref: 'Category',
        required: [true,'category is required']
    },
    reason: {
        type: String,
        required : [true,'reason is required']
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'employer is required']
    },
    isApproved: {
        type: Boolean,
        default: false
    },
    colleagues: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        amountSpent: {
            type: Number,
            default: 0,
        },
        amountReceived: {
            type: Number,
            default: 0
        },
        receipt: String
    }] 
})

//before saving
expenseSchema.pre("save",function(next){
    const expense = this
    if(expense.isNew){
        expense.colleagues.push({
            user: expense.user  
        })
        next()
    }else{
        next()
    }
})

const Expense = mongoose.model("Expense",expenseSchema)

module.exports = {
    Expense
}