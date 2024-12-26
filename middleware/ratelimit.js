const rate=require('express-rate-limit');
const limit=rate({
    windowMs:120*1000,
    max:6,
    statusCode:429,
    message:'you have sent many requests at 2m please wait 2m '
});

module.exports={limit};
