const FAVOURITE = require('../models/favourite');
const PRODUCTS = require('../models/products');


//add to your favourite

const addToFav = async (req, res) => {
    try {
        const { products } = req.body;  // تأكد من الحصول على المنتجات بشكل صحيح
        const userId = req.user.id;

        // تحقق من أن المصفوفة تحتوي على بيانات
        if (!products || products.length === 0) {
            return res.status(400).json({ message: 'No products found' });
        }

        // فحص كل منتج داخل المصفوفة
        for (const productObj of products) {
            const { productId } = productObj;  // الحصول على productId من الكائن داخل المصفوفة

            const product = await PRODUCTS.findById(productId);  // البحث عن المنتج في قاعدة البيانات
            if (!product) {
                return res.status(404).json({ message: `Product with id ${productId} not found` });
            }

            let favourite = await FAVOURITE.findOne({ user: userId });

            if (!favourite) {
                favourite = new FAVOURITE({
                    user: userId,
                    products: []
                });
            }

            const foundFav = favourite.products.findIndex((fav) => fav.productId.toString() === productId);

            if (foundFav >= 0) {
                return res.status(404).json({ message: `Product  ${productId} already in your favourites` });
            }

            favourite.products.push({ productId });  // إضافة المنتج إلى قائمة المفضلة
            await favourite.save();
        }

        return res.status(200).json({ message: 'Products added to favourites' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: `Server error ==> ${err.message}` });
    }
};




// get user favourite list 


const getFavProducts = async (req, res) => {
    try {
        const userId = req.user.id;  

     
        const favourite = await FAVOURITE.findOne({ user: userId }).populate({
            path: 'products.productId', 
            select: 'name price image desc'
        });

        
        if (!favourite) {
            return res.status(404).json({ message: 'No favourite products found for this user.' });
        }

       
        return res.status(200).json(favourite.products);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};


module.exports={
    addToFav,
    getFavProducts
}