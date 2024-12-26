const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usersSchema = new Schema({
    userName: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: [true, 'email is required'],
        unique: true,
        
    },
    password: {
        type: String,
        required: [true, 'password should be at least 8 chars'],
    },
    token: {
        type: String,
    },
    refreshToken: { 
        type: String,
    },
    
    avatar: {
        type: String,
        default: 'uploads/avatar2.png',

    },
role:{
    type:String,
    enum:['User','Admin'],
    default:'User'
}

}, { timestamps: true });


module.exports = mongoose.model('USERS', usersSchema);
