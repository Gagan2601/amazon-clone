import mongoose from "mongoose";

const RefreshToken = new mongoose.Schema({
  token: {
    type: String,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: {
      expires: 3600 * 24 * 30,
    },
  },
});

export default mongoose.model("RefreshToken", RefreshToken);
