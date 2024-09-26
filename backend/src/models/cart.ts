import mongoose, { Document, Schema, Types } from "mongoose";

interface CartItem {
  product: Types.ObjectId;
  quantity: number;
}

export interface CartDocument extends Document {
  user: Types.ObjectId;
  items: CartItem[];
  createdAt: Date;
  updatedAt: Date;
}

const cartItemSchema = new Schema<CartItem>({
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
  },
  quantity: Number,
});

const cartSchema = new Schema<CartDocument>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  items: [cartItemSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Cart = mongoose.model<CartDocument>("Cart", cartSchema);

export default Cart;
