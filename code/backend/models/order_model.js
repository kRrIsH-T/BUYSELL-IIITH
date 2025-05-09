import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    buyerID: { type: String, required: true },
    sellerID: { type: String, required: true },
    items: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Item'
        },
        name: String,
        description: String,
        price: Number,
        imageUrl: String,
        category: String
      }
    ],
    totalAmount: { type: Number, required: true },
    status: { type: String, default: 'pending' },
    otp: { type: String, required: true }
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);