const express = require('express');
const router = express.Router();
const productsController = require('../controller/productsController');
const verfiyToken = require('../middleware/verifyuser');
const limitRequst = require('../middleware/ratelimit');
const CheckAdmin=require('../middleware/adminMiddle')

const multer = require('multer');

const diskstorage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log('FILE ==>', file);
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        const ext = file.mimetype.split('/')[1];
        const Productimg = `product-${Date.now()}.${ext}`;
        cb(null, Productimg)
    }
});

const fileFilter=(req,file,cb)=>{
    const imageType=file.mimetype.split('/')[0];
    if(imageType==='image'){
        return cb(null,true);
    }else{
       return cb('the file must be image',false);
    }
  };

  const upload = multer({storage:diskstorage,fileFilter });

//GET ALL PRODUCTS ROUTE 
router.get('/', verfiyToken, limitRequst.limit, productsController.getAllProducts)


//CREATE  PRODUCTS ROUTE 
router.post('/', verfiyToken,CheckAdmin,upload.single('image'), productsController.createProduct)

//GET ONE PRODUCT ROUTE 
router.get('/:id', verfiyToken, limitRequst.limit, productsController.getOne)

//UPDATE ONE PRODUCTS ROUTE 
router.patch('/:id', verfiyToken,CheckAdmin,limitRequst.limit, productsController.updateProduct)


//DELETE ONE PRODUCTS ROUTE 
router.delete('/:id', verfiyToken,CheckAdmin,limitRequst.limit, productsController.deletedProduct)

module.exports = router;