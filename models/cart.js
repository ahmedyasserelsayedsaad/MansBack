const mongoose=require('mongoose');
const Schema= mongoose.Schema;
const cartSchema=new Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'USERS',
        required:true,
    },
   products:[
    {
    productId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'PRODUCTS',
        required:true,
    },
    quantity:{
        type:Number,
        min:1,
    }
}
   ],
   totalPrice: {
    type: Number,
    required: true,
    default: 0,
},
},{ timestamps: true });

module.exports=mongoose.model('CART',cartSchema);