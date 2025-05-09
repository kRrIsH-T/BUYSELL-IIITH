import mongoose from 'mongoose';
import Item from "../models/item_model.js";
import User from "../models/user_model.js"; // Import the User model

export const getItems = async (req, res) => {
  try {
    const items = await Item.find();
    const itemsWithSellerInfo = await Promise.all(items.map(async (item) => {
      try {
        const seller = await User.findById(item.sellerID).select("username");
        return {
          ...item._doc,
          sellerName: seller ? seller.username : "Unknown",
        };
      } catch (error) {
        console.error(`Failed to fetch seller info for item ${item.id}:`, error);
        return {
          ...item._doc,
          sellerName: "Unknown",
        };
      }
    }));
    res.json(itemsWithSellerInfo);
  } catch (error) {
    console.error("Failed to fetch items:", error);
    res.status(500).json({ error: "Failed to fetch items" });
  }
};

export const createItem = async (req, res) => {
  try {
    const { name, description, price, imageUrl, category, sellerID } = req.body;
    const newItem = new Item({ name, description, price, imageUrl, category, sellerID });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    console.error("Failed to create item:", error);
    res.status(500).json({ error: "Failed to create item" });
  }
};

export const getItemById = async (req, res) => {
  try {
    // Validate if the item ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid item ID format" });
    }

    const item = await Item.findById(req.params.id);
    
    if (!item) {
      console.log('Item not found for ID:', req.params.id);
      return res.status(404).json({ error: "Item not found" });
    }

    // Validate if the seller ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(item.sellerID)) {
      console.log('Invalid seller ID:', item.sellerID);
      const itemObject = item.toObject();
      return res.json({
        ...itemObject,
        sellerName: "Unknown (Invalid Seller ID)"
      });
    }

    const seller = await User.findById(item.sellerID);
    
    if (!seller) {
      console.log('Seller not found for ID:', item.sellerID);
      const itemObject = item.toObject();
      return res.json({
        ...itemObject,
        sellerName: "Unknown (Seller Not Found)"
      });
    }

    // Convert mongoose document to plain object and add seller info
    const itemObject = item.toObject();
    const itemWithSellerInfo = {
      ...itemObject,
      sellerName: seller.username
    };

    res.json(itemWithSellerInfo);

  } catch (error) {
    console.error("Failed to fetch item:", error.message);
    console.error("Stack trace:", error.stack);
    res.status(500).json({ 
      error: "Failed to fetch item",
      details: error.message 
    });
  }
};