import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/user";
import Product from "../models/product";
import Cart, { CartDocument } from "../models/cart";
import Order from "../models/order";
import Seller from "../models/seller";
import * as NotificationController from "./product";
import { ErrorHandler, ControllerResponse } from "../middlewares/errorHandler";
import { Document, Types } from "mongoose";

const saveAddress = async (req: Request, res: Response, Model) => {
  try {
    const { address } = req.body;
    const entityId = req.user;
    const updatedEntity = await Model.findByIdAndUpdate(
      entityId,
      { address: address },
      { new: true }
    );
    ControllerResponse(res, 200, updatedEntity);
  } catch (err) {
    ErrorHandler(res, 500, "Internal Server Error", err);
  }
};

const changeInfo = async (req: Request, res: Response, Model) => {
  try {
    const entityId = req.params.id;
    const { name, email, newPassword } = req.body;
    if (req.user._id !== entityId) {
      ErrorHandler(res, 403, "Access denied");
    }
    const entity = await Model.findById(entityId);
    if (!entity) {
      ErrorHandler(res, 404, "Entity not found");
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
    ControllerResponse(res, 200, "Entity information updated successfully");
  } catch (err) {
    ErrorHandler(res, 500, "Internal Server Error", err);
  }
};

export const saveUserAddress = (req: Request, res: Response) => {
  saveAddress(req, res, User);
};

export const changeUserInfo = (req: Request, res: Response) => {
  changeInfo(req, res, User);
};

export const saveSellerAddress = (req: Request, res: Response) => {
  saveAddress(req, res, Seller);
};

export const changeSellerInfo = (req: Request, res: Response) => {
  changeInfo(req, res, Seller);
};

export const getUserInfo = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      ErrorHandler(res, 404, "User not found");
    }
    ControllerResponse(res, 200, user);
  } catch (err) {
    ErrorHandler(res, 500, "Internal Server Error", err);
  }
};

export const getCartContents = async (req: Request, res: Response) => {
  try {
    const userId = req.user;
    const userCart: CartDocument | null = await Cart.findOne({
      user: userId,
    }).populate("items.product");
    if (!userCart) {
      return ErrorHandler(res, 404, "Cart not found for the user");
    }
    return ControllerResponse(res, 200, userCart);
  } catch (err) {
    return ErrorHandler(res, 500, "Internal Server Error", err);
  }
};

export const addToCart = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    const product = await Product.findById(id);
    const userId = req.user;
    if (!product) {
      ErrorHandler(res, 404, "Product not found");
    }
    let userCart: CartDocument | null = await Cart.findOne({ user: userId });
    if (!userCart) {
      userCart = new Cart({
        user: userId,
        items: [{ product: product.toObject(), quantity: 1 }],
      });
    } else {
      const existingItem = userCart.items.find((item) =>
        item.product.equals(product._id)
      );
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        userCart.items.push({ product: product.toObject(), quantity: 1 });
      }
    }
    await userCart.save();
    ControllerResponse(res, 200, userCart);
  } catch (err) {
    ErrorHandler(res, 500, "Internal Server Error", err);
  }
};

export const removeFromCart = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      ErrorHandler(res, 404, "Product not found");
    }
    const userId = req.user;
    let userCart = await Cart.findOne({ user: userId });
    if (!userCart) {
      ErrorHandler(res, 404, "Cart not found for the user");
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
      ControllerResponse(res, 200, userCart);
    } else {
      ErrorHandler(res, 404, "Product not found in the cart");
    }
  } catch (err) {
    ErrorHandler(res, 500, "Internal Server Error", err);
  }
};

export const order = async (req: Request, res: Response) => {
  try {
    const { totalPrice } = req.body;
    const userId = req.user;
    const userCart = await Cart.findOne({ user: userId });
    const user = await User.findById(userId);
    if (!userCart || userCart.items.length === 0) {
      ErrorHandler(res, 404, "Cart is empty");
    }
    let totalQuantity = 0;
    const productsToUpdate = [];
    const sellerNotifications = [];
    for (const cartItem of userCart.items) {
      const product = await Product.findById(cartItem.product);
      if (!product) {
        ErrorHandler(res, 404, "Product not found");
      }
      if (product.quantity < cartItem.quantity) {
        return res
          .status(400)
          .json({ message: `${product.title} is out of stock` });
      }
      totalQuantity += cartItem.quantity;
      productsToUpdate.push({ product, quantity: cartItem.quantity });
      const sellerId = product.seller;
      console.log(user);
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
      ErrorHandler(res, 404, "User not found");
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
        savedOrder._id.toString(),
        notificationData.productId,
        `New order for ${notificationData.productName} (${notificationData.quantity} units) from ${notificationData.userAddress}`
      );
    }

    await userCart.save();
    ControllerResponse(res, 200, savedOrder);
  } catch (err) {
    ErrorHandler(res, 500, "Internal Server Error", err);
  }
};

export const getSellerNotifications = async (req: Request, res: Response) => {
  try {
    const sellerId = req.user.toString();
    const notifications = await NotificationController.getSellerNotifications(
      sellerId
    );
    ControllerResponse(res, 200, notifications);
  } catch (err) {
    ErrorHandler(res, 500, "Internal Server Error", err);
  }
};

export const myOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find({ userId: req.user });
    ControllerResponse(res, 200, orders);
  } catch (err) {
    ErrorHandler(res, 500, "Internal Server Error", err);
  }
};

export const cancelOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) {
      ErrorHandler(res, 404, "Order not found");
    }
    if (order.status !== "Pending") {
      ErrorHandler(res, 400, "This order cannot be cancelled");
    }
    for (const item of order.products) {
      const product = await Product.findById(item.product);
      if (!product) {
        ErrorHandler(res, 404, "Product not found");
      }
      product.quantity += item.quantity;
      await product.save();
    }
    await Order.findByIdAndDelete(id);
    ControllerResponse(res, 200, "Order canceled successfully");
  } catch (err) {
    ErrorHandler(res, 500, "Internal Server Error", err);
  }
};

export const getSellerOrderDetails = async (req: Request, res: Response) => {
  try {
    const sellerId = req.user._id;
    const { id } = req.params;
    const order = await Order.findOne({
      _id: id,
    })
      .populate("userId", "name email")
      .populate({
        path: "products.product",
        model: "Product",
        select: "title discountedPrice seller",
        populate: {
          path: "seller",
          model: "Seller",
          select: "_id name email",
        },
      });
    if (!order) {
      ErrorHandler(res, 404, "Order not found");
    }
    const hasMatchingProduct = order.products.some((product) =>
      product.product[0].seller._id.equals(sellerId)
    );
    if (!hasMatchingProduct) {
      ErrorHandler(res, 403, "Access denied");
    }
    ControllerResponse(res, 200, order);
  } catch (err) {
    ErrorHandler(res, 500, "Internal Server Error", err);
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const sellerId = req.user._id;
    const { id } = req.params;
    const { status } = req.body;
    const order = await Order.findOne({
      _id: id,
    })
      .populate("userId", "name email")
      .populate({
        path: "products.product",
        model: "Product",
        select: "title discountedPrice seller",
        populate: {
          path: "seller",
          model: "Seller",
          select: "name email",
        },
      });
    if (!order) {
      ErrorHandler(res, 404, "Order not found");
    }
    const hasMatchingProduct = order.products.some((product) =>
      product.product[0].seller._id.equals(sellerId)
    );
    if (!hasMatchingProduct) {
      ErrorHandler(res, 403, "Access denied");
    }
    order.status = status;
    await order.save();

    ControllerResponse(res, 200, "Order status updated successfully");
  } catch (err) {
    ErrorHandler(res, 500, "Internal Server Error", err);
  }
};

export const getSellerOrders = async (req: Request, res: Response) => {
  try {
    const sellerId = req.user._id;
    const sellerProducts = await Product.find({ seller: sellerId });
    const productIds = sellerProducts.map((product) => product._id);
    const sellerOrders = await Order.find({
      "products.product": { $in: productIds },
    })
      .populate("userId", "name email")
      .populate("products.product", "title discountedPrice");

    if (!sellerOrders || sellerOrders.length === 0) {
      ErrorHandler(res, 404, "No orders found for this seller");
    }

    ControllerResponse(res, 200, sellerOrders);
  } catch (err) {
    ErrorHandler(res, 500, "Internal Server Error", err);
  }
};
