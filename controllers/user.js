const User = require("../models/user");
const bcrypt = require("bcrypt");
const Product = require("../models/product");
const Cart = require("../models/cart");
const Order = require("../models/order");
const Seller = require("../models/seller");
const NotificationController = require("./product");
const errorHandler = require("../middlewares/errorHandler");

const saveAddress = async (req, res, Model) => {
  try {
    const { address } = req.body;
    const entityId = req.user;
    const updatedEntity = await Model.findByIdAndUpdate(
      entityId,
      { address: address },
      { new: true }
    );
    res.status(200).json(updatedEntity);
  } catch (err) {
    errorHandler(err, req, res);
  }
};

const changeInfo = async (req, res, Model) => {
  try {
    const entityId = req.params.id;
    const { name, email, newPassword } = req.body;
    if (req.user._id !== entityId) {
      return res.status(403).json({ message: "Access denied" });
    }
    const entity = await Model.findById(entityId);
    if (!entity) {
      return res.status(404).json({ message: "Entity not found" });
    }
    if (name) {
      entity.name = name;
    }
    if (email) {
      entity.email = email;
    }
    if (newPassword) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      entity.password = hashedPassword;
    }
    await entity.save();
    res
      .status(200)
      .json({ message: "Entity information updated successfully" });
  } catch (err) {
    errorHandler(err, req, res);
  }
};

exports.saveUserAddress = (req, res) => {
  saveAddress(req, res, User);
};

exports.changeUserInfo = (req, res) => {
  changeInfo(req, res, User);
};

exports.saveSellerAddress = (req, res) => {
  saveAddress(req, res, Seller);
};

exports.changeSellerInfo = (req, res) => {
  changeInfo(req, res, Seller);
};

exports.getUserInfo = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    errorHandler(err, req, res);
  }
};

exports.getCartContents = async (req, res) => {
  try {
    const userId = req.user;
    const userCart = await Cart.findOne({ user: userId }).populate(
      "items.product"
    );
    if (!userCart) {
      return res.status(404).json({ message: "Cart not found for the user" });
    }
    res.status(200).json(userCart);
  } catch (err) {
    errorHandler(err, req, res);
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { id } = req.body;
    const product = await Product.findById(id);
    const userId = req.user;
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    let userCart = await Cart.findOne({ user: userId });
    if (!userCart) {
      userCart = new Cart({
        user: userId,
        items: [{ product, quantity: 1 }],
      });
    } else {
      const existingItem = userCart.items.find((item) =>
        item.product.equals(product._id)
      );
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        userCart.items.push({ product, quantity: 1 });
      }
    }
    await userCart.save();
    res.status(200).json(userCart);
  } catch (err) {
    errorHandler(err, req, res);
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    const userId = req.user;
    let userCart = await Cart.findOne({ user: userId });
    if (!userCart) {
      return res.status(404).json({ message: "Cart not found for the user" });
    }
    const cartItemIndex = userCart.items.findIndex((item) =>
      item.product.equals(product._id)
    );
    if (cartItemIndex !== -1) {
      if (userCart.items[cartItemIndex].quantity === 1) {
        userCart.items.splice(cartItemIndex, 1);
      } else {
        userCart.items[cartItemIndex].quantity -= 1;
      }
      await userCart.save();
      res.status(200).json(userCart);
    } else {
      res.status(404).json({ message: "Product not found in the cart" });
    }
  } catch (err) {
    errorHandler(err, req, res);
  }
};

exports.order = async (req, res) => {
  try {
    const { totalPrice } = req.body;
    const userId = req.user;
    const userCart = await Cart.findOne({ user: userId });
    const user = await User.findById(userId);
    if (!userCart || userCart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }
    let totalQuantity = 0;
    const productsToUpdate = [];
    const sellerNotifications = [];
    for (const cartItem of userCart.items) {
      const product = await Product.findById(cartItem.product);
      if (!product) {
        return res.status(400).json({ message: "Product not found" });
      }
      if (product.quantity < cartItem.quantity) {
        return res
          .status(400)
          .json({ message: `${product.title} is out of stock` });
      }
      totalQuantity += cartItem.quantity;
      productsToUpdate.push({ product, quantity: cartItem.quantity });
      const sellerId = product.seller;
      sellerNotifications.push({
        sellerId,
        userId,
        productId: product._id,
        productName: product.title,
        quantity: cartItem.quantity,
        userAddress: `${user.address.addressline1} ${user.address.addressline2}, ${user.address.city}, ${user.address.state}, ${user.address.postalCode}`,
      });
    }
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const shippingAddress = `${user.address.addressline1} ${user.address.addressline2}, ${user.address.city}, ${user.address.state}, ${user.address.postalCode}`;
    userCart.items = [];
    const order = new Order({
      products: productsToUpdate.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
      })),
      totalPrice,
      shippingAddress,
      userId,
      orderDate: new Date(),
      status: "Pending",
    });
    const savedOrder = await order.save();
    user.orders.push(savedOrder._id);
    await user.save();
    for (const notificationData of sellerNotifications) {
      await NotificationController.createNotification(
        notificationData.sellerId,
        notificationData.userId,
        savedOrder._id,
        notificationData.productId,
        `New order for ${notificationData.productName} (${notificationData.quantity} units) from ${notificationData.userAddress}`
      );
    }

    await userCart.save();
    res.status(200).json(savedOrder);
  } catch (err) {
    errorHandler(err, req, res);
  }
};

exports.getSellerNotifications = async (req, res) => {
  try {
    const sellerId = req.user;
    const notifications = await NotificationController.getSellerNotifications(
      sellerId
    );
    res.status(200).json(notifications);
  } catch (error) {
    errorHandler(err, req, res);
  }
};

exports.myOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user });
    res.status(200).json(orders);
  } catch (err) {
    errorHandler(err, req, res);
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    if (order.status !== "Pending") {
      return res
        .status(400)
        .json({ message: "This order cannot be cancelled" });
    }
    for (const item of order.products) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      product.quantity += item.quantity;
      await product.save();
    }
    await Order.findByIdAndDelete(id);
    res.status(200).json({ message: "Order canceled successfully" });
  } catch (err) {
    errorHandler(err, req, res);
  }
};

// //This controller need to be put at correct place
// exports.changeStatus = async (req, res) => {
//     try {
//         const { id, status } = req.body;
//         let order = await Order.findById(id);
//         order.status = status;
//         order = await order.save();
//         res.status(200).json(order);
//     } catch (err) {
//         res.status(500).json({message: 'Internal server error'})
//     }
// }
