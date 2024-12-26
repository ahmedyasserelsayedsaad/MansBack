const express=require('express');
const favouriteController=require('../controller/favouriteController');
const verfiyToken = require('../middleware/verifyuser');
const limitRequst = require('../middleware/ratelimit');
const router = express.Router();



//add to cart route


router.post('/',verfiyToken,favouriteController.addToFav);


router.get('/',verfiyToken,favouriteController.getFavProducts);


module.exports = router;