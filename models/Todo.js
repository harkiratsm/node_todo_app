const mongoose=require('mongoose')
const TodoSchema=mongoose.Schema({
    todo:String
})
module.exports=mongoose.model("Todo",TodoSchema)