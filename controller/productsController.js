const PRODUCTS=require('../models/products');




//all products

const getAllProducts=async(req,res)=>{
try{
    const products=await PRODUCTS.find();
    if(!products || products.length===0){
        return res.status(404).json({message:"not found products in your application"})
    }
    res.status(200).json(products);
}
catch(err){
    return  res.status(500).json({message:`server error==>${err}`});
}
}


//get one product

const getOne=async(req,res)=>{
    try{
        const Id=req.params.id;
        const Product=await PRODUCTS.findById(Id);
        if(!Product){
            return res.status(400).json({message:'not found product by this id'})
        }
        res.status(200).json(Product)
    }
    catch(err){
      return  res.status(500).json({message:`server error==>${err}`});
        
    }
}


//create products

const createProduct=async(req,res)=>{
try{
    console.log(req.file);
    const {title,desc,price,rate,quantity,category}=req.body;
    console.log(typeof(quantity))
    if(!title || !desc || !price || !rate || !quantity ||!category){
      return res.status(400).json({message:'all feilds are required'});
    }
    if(quantity<1){
        return res.status(400).json({message:'quantity must be more than 0 or at least 1 product '});
    }
    const newProduct = new PRODUCTS ({
        title,
        desc,
        price,
        rate,
        quantity,
        category,
        image:req.file.filename,
    });
    const saveProduct=await newProduct.save();
    res.status(200).json({message:`one products is created${saveProduct}`})
}
catch(err){
   return res.status(500).json({message:`server error==>${err}`});
}
}


//update product

const updateProduct=async(req,res)=>{
    try{
        const Id=req.params.id;
        const product=await PRODUCTS.findById(Id);
        if(!product){
            return res.status(400).json({message:'not found product by this id'});
        }
        const updatedProduct=await PRODUCTS.updateOne({_id:Id},{$set:{...req.body}})
        return  res.status(200).json({ message: `products is updated successfully${updatedProduct}`})

    }
    catch(err){
        return  res.status(500).json({message:`server error==>${err}`});
    }
}

//deleted product

const deletedProduct=async(req,res)=>{
    try{
        const Id=req.params.id;
        const product=await PRODUCTS.findById(Id);
        if(!product){
            return res.status(400).json({message:'not found product by this id'});
        }  

        await PRODUCTS.deleteOne({_id:Id});
        return res.status(200).json({message:`product ${product.title} is deleted successfully`})
    }
    catch(err){
        return  res.status(500).json({message:`server error==>${err}`});
     }  
}


module.exports={
    getAllProducts,
    getOne,
    createProduct,
    updateProduct,
    deletedProduct,
}