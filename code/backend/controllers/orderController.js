import Order from "../models/order_model.js";
import Item from "../models/item_model.js";  // Add this import
import CryptoJS from "crypto-js";
import dotenv from "dotenv";

dotenv.config();

const secretKey = "supersecretkey";
if (!secretKey) {
  console.error("CRYPTO_SECRET_KEY is not defined in .env");
}

export const createOrder = async (req, res) => {
  try {
    const { buyerID, sellerID, items, totalAmount, status, otp } = req.body;
    console.log("Creating order with OTP:", otp);

    if (!secretKey) {
      throw new Error("CRYPTO_SECRET_KEY is not defined in .env");
    }
    // Encrypt OTP and convert to string
    const encryptedOtp = CryptoJS.AES.encrypt(otp, secretKey).toString();
    console.log("Encrypted OTP:", encryptedOtp);

    const newOrder = new Order({
      buyerID,
      sellerID,
      items,
      totalAmount,
      status,
      otp: encryptedOtp,
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { orderId, otp } = req.body;
    
    // Validate inputs
    if (!orderId || !otp) {
      return res.status(400).json({ error: "OrderId and OTP are required" });
    }

    const order = await Order.findById(orderId).populate('items');
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Decrypt and verify OTP
    const bytes = CryptoJS.AES.decrypt(order.otp, secretKey);
    const decryptedOtp = bytes.toString(CryptoJS.enc.Utf8);

    if (otp !== decryptedOtp) {
      return res.status(401).json({ 
        error: "Invalid OTP",
        success: false
      });
    }

    // If OTP is valid, proceed with order completion
    try {
      // Delete all items in the order from the items collection
      for (const item of order.items) {
        await Item.findByIdAndDelete(item._id);
      }

      // Update order status
      order.status = "delivered";
      await order.save();

      res.json({ 
        success: true,
        message: "Order delivered successfully and items removed" 
      });
    } catch (deleteError) {
      console.error("Error deleting items:", deleteError);
      return res.status(500).json({ 
        error: "Failed to complete order process",
        success: false
      });
    }

  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({ 
      error: "Failed to verify OTP",
      success: false
    });
  }
};

export const getOrderHistory = async (req, res) => {
  try {
    const { userID, role } = req.query;
    const query = role === "seller" ? { sellerID: userID } : { buyerID: userID };
    const orders = await Order.find(query)
      .populate("items.itemID")
      .populate("buyerID", "username email")
      .populate("sellerID", "username email");
    res.json(orders);
  } catch (error) {
    console.error("Get order history error:", error);
    res.status(500).json({ error: "Failed to fetch order history" });
  }
};

export const getPendingOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      buyerID: req.params.userId,
      status: "pending",
    })
      .populate("items")
      .lean();

    const ordersWithDecryptedOtp = orders.map((order) => {
      try {
        const bytes = CryptoJS.AES.decrypt(order.otp, secretKey);
        const decryptedOtp = bytes.toString(CryptoJS.enc.Utf8);
        return { ...order, otp: decryptedOtp || "Decryption failed" };
      } catch (error) {
        console.error("Decryption error for order:", order._id, error);
        return { ...order, otp: "Decryption failed" };
      }
    });

    res.json(ordersWithDecryptedOtp);
  } catch (error) {
    console.error("Pending orders error:", error);
    res.status(500).json({ error: "Failed to fetch pending orders" });
  }
};

export const getBoughtOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      buyerID: req.params.userId,
      status: "delivered",
    })
      .populate("items")
      .lean();

    const ordersWithDecryptedOtp = orders.map((order) => {
      try {
        const bytes = CryptoJS.AES.decrypt(order.otp, secretKey);
        const decryptedOtp = bytes.toString(CryptoJS.enc.Utf8);
        return { ...order, otp: decryptedOtp || "Decryption failed" };
      } catch (error) {
        console.error("Decryption error for order:", order._id, error);
        return { ...order, otp: "Decryption failed" };
      }
    });

    res.json(ordersWithDecryptedOtp);
  } catch (error) {
    console.error("Bought orders error:", error);
    res.status(500).json({ error: "Failed to fetch bought orders" });
  }
};

export const getSoldOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      sellerID: req.params.userId,
    })
      .populate("items")
      .lean();

    const ordersWithDecryptedOtp = orders.map((order) => {
      try {
        const bytes = CryptoJS.AES.decrypt(order.otp, secretKey);
        const decryptedOtp = bytes.toString(CryptoJS.enc.Utf8);
        return { ...order, otp: decryptedOtp || "Decryption failed" };
      } catch (error) {
        console.error("Decryption error for order:", order._id, error);
        return { ...order, otp: "Decryption failed" };
      }
    });

    res.json(ordersWithDecryptedOtp);
  } catch (error) {
    console.error("Sold orders error:", error);
    res.status(500).json({ error: "Failed to fetch sold orders" });
  }
};