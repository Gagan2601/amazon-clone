const Product = require('../models/product');
const Seller = require('../models/seller');
const Review = require('../models/review');

exports.addProduct = async (req, res) => {
    try {
        const seller = await Seller.findById(req.user); 
        if (!seller) {
            return res.status(403).json({ message: 'Seller not found' });
        }
        const { title, description, images, quantity, originalPrice,discountedPrice, category} = req.body;
        const newProduct = new Product({
            title,
            description,
            images,
            quantity,
            originalPrice,
            discountedPrice,
            category,
            seller: seller._id
        });
        await newProduct.save();
        seller.products.push(newProduct); 
        await seller.save();
        res.status(201).json({message: 'Product added successfully'})
    } catch (err) {
        console.log(err);
        res.status(500).json({message: 'Internal server error'});
    }
}

exports.updateProduct = async (req, res) => {
    try {
        const seller = await Seller.findById(req.user); 
        if (!seller) {
            return res.status(403).json({ message: 'You do not have permission to update products' });
        }
        const productId = req.params.productId;
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({message: 'Product not found'});
        }
        const { title, description, images, quantity, originalPrice, discountedPrice, category } = req.body;
        product.title = title;
        product.description = description;
        product.images = images;
        product.quantity = quantity;
        product.originalPrice = originalPrice;
        product.discountedPrice = discountedPrice;
        product.category = category;
        await product.save();
        res.status(200).json({message: 'Product updated successfully'});
    } catch (err) {
        res.status(500).json({message: 'Internal server error'});
    }
}

exports.deleteProduct = async (req, res) => {
    try {
        const seller = await Seller.findById(req.user); 
        if (!seller) {
            return res.status(403).json({ message: 'You do not have permission to delete products' });
        }
        const productId = req.params.productId;
        const product = await Product.findById(productId);
        if(!product) {
            return res.status(404).json({message: 'Product not found'});
        }
        await product.deleteOne({_id: productId});
        res.status(200).json({message: 'Product deleted successfully'});
    } catch (err) {
        console.log(err)
        res.status(500).json({message: 'Internal server error'});
    }
}

exports.viewProduct = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({message: 'Internal server error'});
    }
};

exports.searchProduct = async (req, res) => {
    try {
        const products = await Product.find({
            title: { $regex: req.params.name, $options: "i" },
        });
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({message: 'Internal server error'})
    }
};

exports.reviewProduct = async (req, res) => {
    try {
        const { id, rating, comment, images } = req.body;
        const userId = req.user;
        let product = await Product.findById(id).populate('reviews');
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        const newReview = new Review({
            userId,
            product: id,
            rating,
            comment,
            images,
            date: new Date(),
        });
        await newReview.save();
        product.reviews.push(newReview._id);
        await product.save();
        res.status(200).json(product);
    } catch (err) {
        console.log(err)
        res.status(500).json({message: 'Internal server error'});
    }
};

exports.dealoftheday = async (req, res) => {
    try {
        const products = await Product.find({}).populate('reviews');
        const sortedProducts = products.sort((a, b) => {
            const aSum = a.reviews.reduce((sum, review) => sum + review.rating, 0);
            const bSum = b.reviews.reduce((sum, review) => sum + review.rating, 0);
            return aSum < bSum ? 1 : -1;
        });
        res.status(200).json(sortedProducts[0]);
    } catch (err) {
        res.status(500).json({message: 'Inernal server error'})
    }
};