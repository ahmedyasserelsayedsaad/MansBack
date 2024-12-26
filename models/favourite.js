const mongoose=require('mongoose');
const Schema= mongoose.Schema;
const favSchema=new Schema({
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
                required:true
            }
        }
       
    ]
},{ timestamps: true });



module.exports=mongoose.model('FAVOURITE',favSchema);