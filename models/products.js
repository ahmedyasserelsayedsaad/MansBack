const mongoose=require('mongoose');
const Schema= mongoose.Schema;
const productsSchema=new Schema({
    title:{
        type:String,
        required:true
    },
    desc:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    category:{
        type:String,
        required:true
    },

    image:{
        type:String,
        default:'/uploads/avatar2.png'
    },
    
    rate:{
        type:Number,
        required:true
    },
    quantity:{
        type:Number,
        required:true
    },
},{ timestamps: true });


module.exports=mongoose.model('PRODUCTS',productsSchema);