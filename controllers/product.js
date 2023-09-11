const Product = require("../models/product");
const Seller = require("../models/seller");
const Review = require("../models/review");
const Notification = require("../models/notification");
const errorHandler = require("../middlewares/errorHandler");

exports.addProduct = async (req, res) => {
  try {
    const seller = await Seller.findById(req.user);
    if (!seller) {
      return res.status(403).json({ message: "Seller not found" });
    }
    const {
      title,
      description,
      images,
      quantity,
      originalPrice,
      discountedPrice,
      category,
    } = req.body;
    const newProduct = new Product({
      title,
      description,
      images,
      quantity,
      originalPrice,
      discountedPrice,
      category,
      seller: seller._id,
    });
    await newProduct.save();
    seller.products.push(newProduct);
    await seller.save();
    res.status(201).json({ message: "Product added successfully" });
  } catch (err) {
    errorHandler(err, req, res);
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const seller = await Seller.findById(req.user);
    if (!seller) {
      return res
        .status(403)
        .json({ message: "You do not have permission to update products" });
    }
    const productId = req.params.productId;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    const {
      title,
      description,
      images,
      quantity,
      originalPrice,
      discountedPrice,
      category,
    } = req.body;
    if (title) {
      product.title = title;
    }
    if (description) {
      product.description = description;
    }
    if (images) {
      product.images = images;
    }
    if (quantity) {
      product.quantity = quantity;
    }
    if (originalPrice) {
      product.originalPrice = originalPrice;
    }
    if (discountedPrice) {
      product.discountedPrice = discountedPrice;
    }
    if (category) {
      product.category = category;
    }
    await product.save();
    res.status(200).json({ message: "Product updated successfully" });
  } catch (err) {
    errorHandler(err, req, res);
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const seller = await Seller.findById(req.user);
    if (!seller) {
      return res
        .status(403)
        .json({ message: "You do not have permission to delete products" });
    }
    const productId = req.params.productId;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    await product.deleteOne({ _id: productId });
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    errorHandler(err, req, res);
  }
};

exports.viewProduct = async (req, res) => {
  try {
    const products = await Product.find().populate({
      path: "seller",
      select: "name email address",
    });
    res.status(200).json(products);
  } catch (err) {
    errorHandler(err, req, res);
  }
};

exports.getSellerProducts = async (req, res) => {
  try {
    const seller = await Seller.findById(req.user);
    if (!seller) {
      return res
        .status(403)
        .json({ message: "You do not have permission to view products" });
    }
    const sellerProducts = await Product.find({ seller: seller._id });
    res.status(200).json(sellerProducts);
  } catch (err) {
    errorHandler(err, req, res);
  }
};

exports.searchProduct = async (req, res) => {
  try {
    const products = await Product.find({
      title: { $regex: req.params.name, $options: "i" },
    });
    res.status(200).json(products);
  } catch (err) {
    errorHandler(err, req, res);
  }
};

exports.reviewProduct = async (req, res) => {
  try {
    const { id, rating, comment, images } = req.body;
    const userId = req.user;
    let product = await Product.findById(id).populate("reviews");
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
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
    errorHandler(err, req, res);
  }
};

exports.getReviewsByProductId = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId).populate("reviews");
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ reviews: product.reviews });
  } catch (err) {
    errorHandler(err, req, res);
  }
};

exports.dealoftheday = async (req, res) => {
  try {
    const products = await Product.find({}).populate("reviews");
    const sortedProducts = products.sort((a, b) => {
      const aSum = a.reviews.reduce((sum, review) => sum + review.rating, 0);
      const bSum = b.reviews.reduce((sum, review) => sum + review.rating, 0);
      return aSum < bSum ? 1 : -1;
    });
    res.status(200).json(sortedProducts[0]);
  } catch (err) {
    errorHandler(err, req, res);
  }
};

exports.createNotification = async (sellerId, userId, orderId, productId) => {
  try {
    const notification = new Notification({
      seller: sellerId,
      order: orderId,
      user: userId,
      product: productId,
      message: "You have a new order for your product.",
    });
    await notification.save();
  } catch (error) {
    console.error(error);
  }
};

exports.getSellerNotifications = async (sellerId) => {
  try {
    const notifications = await Notification.find({ seller: sellerId }).sort(
      "-createdAt"
    );
    return notifications;
  } catch (error) {
    console.error(error);
    return [];
  }
};

exports.filterAndSortProducts = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, sortBy, sortOrder } = req.query;
    let query = [];
    if (category) {
      query.category = category;
    }
    if (minPrice && maxPrice) {
      query.discountedPrice = {
        $gte: parseFloat(minPrice),
        $lte: parseFloat(maxPrice),
      };
    } else if (minPrice) {
      query.discountedPrice = { $gte: parseFloat(minPrice) };
    } else if (maxPrice) {
      query.discountedPrice = { $lte: parseFloat(maxPrice) };
    }
    let sortQuery = {};
    if (sortBy) {
      sortQuery[sortBy] = sortOrder === "asc" ? 1 : -1;
    }
    const products = await Product.find(query)
      .sort(sortQuery)
      .populate("seller");
    res.status(200).json(products);
  } catch (err) {
    errorHandler(err, req, res);
  }
};
