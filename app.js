const express=require('express');
const mongoose=require('mongoose');
const path=require('path');
const cors=require('cors');
const app=express();
const dotenv=require('dotenv');

//users imports 
const UsersRouts=require('./routers/usersRouts');
//products imports
const ProductsRouts=require('./routers/productsRouts');
//cart routs imports
const CartRouts=require('./routers/cartRouts');
// favourite route Imports
const FavouriteRouts=require('./routers/favouriteRoute');




dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin:'http://localhost:8100',
    methods:['GET','POST','DELETE','PATCH','PUT'],
    allowedHeaders:['content-type','Authorization'],
}))
const port=process.env.PORT;



app.use('/users',UsersRouts);
app.use('/products',ProductsRouts);
app.use('/cart',CartRouts);
app.use('/favourite',FavouriteRouts);

//static middelware
app.use('/uploads',express.static(path.join(__dirname,'uploads')));







//connect to database
mongoose.connect(process.env.DB_URL)
.then(()=>
    {console.log("server connect to db successfuly")

    })
.catch((err)=> 
   { console.log(`db not connect ${err}`)}
)


//test application
app.get('/',(req,res)=>{
    res.send('hello worled');
});

 app.all('*',(req,res)=>{
    res.status(404).json('page error 404');
 });

//application listen
app.listen(port,()=>{
    console.log(`server is running on port ${port}`)
})