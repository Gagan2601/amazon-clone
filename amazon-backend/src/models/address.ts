import mongoose from "mongoose";
const addressSchema = new mongoose.Schema({
  addressline1: String,
  addressline2: String,
  city: String,
  state: String,
  country: String,
  postalCode: String,
  isDefault: Boolean,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});
export default addressSchema;
