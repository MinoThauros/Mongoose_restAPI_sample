const mongoose = require('mongoose');
const schema= mongoose.Schema;
require('mongoose-currency').loadType(mongoose);//loads the library to mongoose
const Currency=mongoose.Types.Currency;

const commentSchema=new schema({
    rating:{
        type:Number,
        min:1,
        max:5,
        required:true
    },
    comment:{
        type:String,
        required:true
    },
    author:{
        type:String,
        required:true
    },
 

},{
    timestamps:true
})
const dishSchema= new schema({
    name:{
        type: String,
        required:true,
        unique:false,
    },
    description:{
        type:String,
        required: true,
    },
    image:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    label:{
        type:String,
        default:''
    },
    price:{
        type:Currency,
        required:true,
        min:0
    },
    featured:{
        type:Boolean,
        default:false,
    },
    comments:[commentSchema]//an array of comments
},{
        timestamps:true//second variable of the new Schema() constructor
});//array of commentSchema; many comments for every element



var Dishes=mongoose.model('Dish', dishSchema);//will create a model based on the schema
module.exports=Dishes;