import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  imageUrl: { type: String },
  category: { type: String, required: true },
  sellerID: { type: String, required: true }, // Keep sellerID as a string
}, { timestamps: true });

export default mongoose.model("Item", itemSchema);