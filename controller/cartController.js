const CART = require('../models/cart');
const PRODUCTS = require('../models/products');





//add products to users cart
const addToCart = async (req, res) => {
    try {
        const { products } = req.body;  
        const userId = req.user.id;   
        console.log(req.body);

        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ message: 'Products array is required and must not be empty.' });
        }

        let totalPrice = 0;

        
        for (const item of products) {
            const { productId, quantity } = item;

            if (!productId || quantity < 1) {
                return res.status(400).json({ message: 'not found product and quantity must be 1 at least.' });
            }

            const product = await PRODUCTS.findById(productId);
            if (!product) {
                return res.status(404).json({ message: `Product with ID ${productId} not found.` });
            }

            if (quantity > product.quantity) {
                return res.status(400).json({ message: `Only ${product.quantity} item available for product ${productId}.` });
            }

            totalPrice += product.price * quantity;
        }

        const cart = await CART.findOne({ user: userId });
        if (!cart) {
            cart = new CART({
                user: userId,
                products: [],
                totalPrice: 0,
            });
        }

        for (const item of products) {
            const { productId, quantity } = item;
            console.log(typeof (quantity));
            const foundedProduct = cart.products.findIndex((p) => p.productId.toString() === productId);
            if (foundedProduct >= 0) {
                cart.products[foundedProduct].quantity += quantity;
            } else {
                cart.products.push({ productId, quantity });
            }

            const product = await PRODUCTS.findById(productId);
            product.quantity -= quantity;
            await product.save();
        }

        cart.totalPrice += totalPrice;
        await cart.save();

        return res.status(200).json(cart);
    } catch (err) {
        return res.status(500).json({ message: `Server error ==> ${err.message}` });
    }
};




//get users cart 

const getCart = async (req, res) => {
    try {
        const userId = req.user.id; 

        const cart = await CART.findOne({ user: userId }).populate({
            path: 'products.productId', 
            select: 'name price image desc'
        });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        return res.status(200).json(cart);
    } catch (err) {
        res.status(500).json({ message: `Server error ==> ${err.message}` });
    }
};



// remove product from users cart
const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.user.id;

        if (!productId) {
            return res.status(400).json({ message: 'Product ID is required.' });
        }
        const cart = await CART.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found.' });
        }

        const foundProduct = cart.products.findIndex((p) => p.productId.toString() === productId);
        if (foundProduct === -1) {
            return res.status(404).json({ message: `Product with ID ${productId} not found in cart.` });
        }

        const product = await PRODUCTS.findById(productId);
        if (!product) {
            return res.status(404).json({ message: `Product with ID ${productId} not found.` });
        }

        const quantityToRestore = cart.products[foundProduct].quantity;
        product.quantity += quantityToRestore;

        cart.products.splice(foundProduct, 1);

        cart.totalPrice -= product.price * quantityToRestore;

        await product.save();
        await cart.save();

        return res.status(200).json(cart);
    } catch (err) {
        return res.status(500).json({ message: `Server error ==> ${err.message}` });
    }
};



module.exports = {
    addToCart,
    getCart,
    removeFromCart
};
