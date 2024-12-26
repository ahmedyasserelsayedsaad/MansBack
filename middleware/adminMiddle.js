const CheckAdmin=async(req,res,next)=>{
    try{
const userRole=req.user.role;
if(userRole!=='Admin'){
return res.status(403).json({message:'you are not admin ,accsess denied'})
}
next();
    }
    catch(err){
        return res.status(500).json({message:`server error ${err.message}`})
    }
};

module.exports=CheckAdmin;