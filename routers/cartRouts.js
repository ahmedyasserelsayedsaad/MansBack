const express=require('express');
const cartController=require('../controller/cartController');
const verfiyToken = require('../middleware/verifyuser');
const limitRequst = require('../middleware/ratelimit');
const router = express.Router();



//add to cart route


router.post('/',verfiyToken,cartController.addToCart);


router.get('/',verfiyToken,cartController.getCart);

router.delete('/remove',verfiyToken,cartController.removeFromCart);

module.exports = router;