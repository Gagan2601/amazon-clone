import { Request, Response } from "express";
import Product from "../models/product";
import Seller from "../models/seller";
import Review from "../models/review";
import Notification from "../models/notification";
import { ErrorHandler, ControllerResponse } from "../middlewares/errorHandler";
import stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "";
const stripeClient = new stripe(stripeSecretKey, {
  apiVersion: "2022-11-15",
});

export const addProduct = async (req: Request, res: Response) => {
  try {
    const seller = await Seller.findById(req.user);
    if (!seller) {
      return ErrorHandler(res, 403, "Seller not found");
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
    seller.products.push(newProduct as any);
    await seller.save();
    ControllerResponse(res, 201, "Product added successfully");
  } catch (err) {
    ErrorHandler(res, 500, "Internal Server Error", err);
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const seller = await Seller.findById(req.user);
    if (!seller) {
      return ErrorHandler(
        res,
        403,
        "You do not have permission to update products"
      );
    }

    const productId = req.params.productId;
    const product = await Product.findById(productId);

    if (!product) {
      return ErrorHandler(res, 404, "Product not found");
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

    ControllerResponse(res, 200, "Product updated successfully");
  } catch (err) {
    ErrorHandler(res, 500, "Internal Server Error", err);
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const seller = await Seller.findById(req.user);
    if (!seller) {
      return ErrorHandler(
        res,
        403,
        "You do not have permission to delete products"
      );
    }

    const productId = req.params.productId;
    const product = await Product.findById(productId);

    if (!product) {
      return ErrorHandler(res, 404, "Product not found");
    }

    await product.deleteOne({ _id: productId });
    ControllerResponse(res, 200, "Product deleted successfully");
  } catch (err) {
    ErrorHandler(res, 500, "Internal Server Error", err);
  }
};

export const viewProduct = async (req: Request, res: Response) => {
  try {
    const products = await Product.find().populate({
      path: "seller",
      select: "name email address",
    });
    ControllerResponse(res, 200, products);
  } catch (err) {
    ErrorHandler(res, 500, "Internal Server Error", err);
  }
};

export const getSellerProducts = async (req: Request, res: Response) => {
  try {
    const seller = await Seller.findById(req.user);
    if (!seller) {
      return ErrorHandler(
        res,
        404,
        "You do not have permission to view products"
      );
    }

    const sellerProducts = await Product.find({ seller: seller._id });
    ControllerResponse(res, 200, sellerProducts);
  } catch (err) {
    ErrorHandler(res, 500, "Internal Server Error", err);
  }
};

export const searchProduct = async (req: Request, res: Response) => {
  try {
    const products = await Product.find({
      title: { $regex: req.params.name, $options: "i" },
    });
    ControllerResponse(res, 200, products);
  } catch (err) {
    ErrorHandler(res, 500, "Internal Server Error", err);
  }
};

export const reviewProduct = async (req: Request, res: Response) => {
  try {
    const { id, rating, comment, images } = req.body;
    const userId = req.user;

    let product = await Product.findById(id).populate("reviews");

    if (!product) {
      return ErrorHandler(res, 404, "Product not found");
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

    ControllerResponse(res, 200, product);
  } catch (err) {
    ErrorHandler(res, 500, "Internal Server Error", err);
  }
};

export const getReviewsByProductId = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId).populate("reviews");

    if (!product) {
      return ErrorHandler(res, 404, "Product not found");
    }

    ControllerResponse(res, 200, { reviews: product.reviews });
  } catch (err) {
    ErrorHandler(res, 500, "Internal Server Error", err);
  }
};

export const checkout = async (req: Request, res: Response) => {
  try {
    const { productId, quantity } = req.body;
    const product = await Product.findById(productId);

    if (!product) {
      return ErrorHandler(res, 404, "Product not found");
    }

    const session = await stripeClient.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: product.title,
            },
            unit_amount: product.discountedPrice * 100,
          },
          quantity: quantity,
        },
      ],
      mode: "payment",
      success_url: `http://localhost:3000/product/order?price=${
        product.discountedPrice * quantity
      }&address=${encodeURIComponent("Your Shipping Address")}`,
      cancel_url: "http://localhost:3000/user/cart",
    });

    ControllerResponse(res, 200, { sessionId: session.id });
  } catch (err) {
    ErrorHandler(res, 500, "Internal Server Error", err);
  }
};

export const dealoftheday = async (req: Request, res: Response) => {
  try {
    const products = await Product.find({}).populate("reviews");
    const productsWithReviews = products.map((product) => ({
      ...product.toObject(),
      reviews: (product.reviews as any[]).map((review) => ({
        rating: review.rating,
      })),
    }));

    const sortedProducts = productsWithReviews.sort((a, b) => {
      const aSum = a.reviews.reduce((sum, review) => sum + review.rating, 0);
      const bSum = b.reviews.reduce((sum, review) => sum + review.rating, 0);
      return aSum < bSum ? 1 : -1;
    });

    ControllerResponse(res, 200, sortedProducts[0]);
  } catch (err) {
    ErrorHandler(res, 500, "Internal Server Error", err);
  }
};

export const createNotification = async (
  sellerId: string,
  userId: string,
  orderId: string,
  productId: string,
  message?: string
) => {
  try {
    const notification = new Notification({
      seller: sellerId,
      order: orderId,
      user: userId,
      product: productId,
      message: message || "You have a new order for your product.",
    });

    await notification.save();
  } catch (error) {
    console.error(error);
  }
};

export const getSellerNotifications = async (sellerId: string) => {
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

export const filterAndSortProducts = async (req: Request, res: Response) => {
  try {
    const { category, minPrice, maxPrice, sortBy, sortOrder } = req.query;
    let query: any = {};

    if (category) {
      query.category = category;
    }
    if (minPrice && maxPrice) {
      query.discountedPrice = {
        $gte: parseFloat(minPrice as string),
        $lte: parseFloat(maxPrice as string),
      };
    } else if (minPrice) {
      query.discountedPrice = { $gte: parseFloat(minPrice as string) };
    } else if (maxPrice) {
      query.discountedPrice = { $lte: parseFloat(maxPrice as string) };
    }

    let sortQuery: any = {};

    if (sortBy) {
      sortQuery[sortBy as string] = sortOrder === "asc" ? 1 : -1;
    }

    const products = await Product.find(query)
      .sort(sortQuery)
      .populate("seller");
    ControllerResponse(res, 200, products);
  } catch (err) {
    ErrorHandler(res, 500, "Internal Server Error", err);
  }
};

export const fetchProductDetails = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);

    if (!product) {
      return ErrorHandler(res, 404, "Product not found");
    }

    ControllerResponse(res, 200, product);
  } catch (err) {
    ErrorHandler(res, 500, "Internal Server Error", err);
  }
};
