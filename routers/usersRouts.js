const express=require('express');
const router=express.Router();
const usersController=require('../controller/usersController')
const limitApi=require('../middleware/ratelimit')
const verfiyToken=require('../middleware/verifyuser');
const CheckAdmin=require('../middleware/adminMiddle')
const multer  = require('multer')

const diskstorage=multer.diskStorage({
    destination:function(req,file,cb){
        console.log('FILE ==>',file)
        cb(null,'uploads')
    },
    filename: function (req, file, cb) {
        const fileExt=file.mimetype.split('/')[1];
      const fileName = `user-${Date.now()}.${fileExt}`
      cb(null,fileName)
    }
});


const fileFilter=(req,file,cb)=>{
const imageType=file.mimetype.split('/')[0];
if(imageType==='image'){
    return cb(null,true);
}else{
   return cb('the file must be image',false);
}
}
const upload = multer({storage:diskstorage,fileFilter });




router.get('/',limitApi.limit,verfiyToken,CheckAdmin,usersController.GetAllUsers);

//register route
router.post('/register',upload.single('avatar'),usersController.userRegister);

//login
router.post('/login',usersController.Login);

//logout 
router.post('/logout',verfiyToken,usersController.logout);

router.post('/refrsh-Token',usersController.refreshAccessToken);



module.exports=router;