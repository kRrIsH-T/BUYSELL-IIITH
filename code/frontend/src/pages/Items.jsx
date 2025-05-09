import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout/Layout.jsx";
import { useAuth } from "../context/auth.jsx";
import { useCart } from "../context/cartcontext.jsx"; 
import { toast } from "react-toastify";
import "./styles/items.css";

const Items = () => {
  const [items, setItems] = useState([]);
  const { auth } = useAuth(); // Use the auth context to get the current user
  const { addToCart } = useCart(); // Use the addToCart function from the cart context
  console.log(auth.user)
  // console.log(item)

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/items");
        setItems(res.data);
      } catch (error) {
        console.error("Failed to fetch items:", error);
      }
    };

    fetchItems();
  }, []);

  const handleAddToCart = (item) => {
    console.log(item.sellerID)
    console.log(auth.user.email)
    if (item.sellerID === auth.user.email) {
      toast.error("You cannot add your own item to the cart.");
      return;
    }
    addToCart(item);
    toast.success(
      <div>
        Item added to cart! <a href="/cart">Go to Cart</a>
      </div>
    );
  };

  return (
    <Layout>
      <div className="items-container">
        <h1>Available Items</h1>
        <div className="items-list">
          {items.map((item) => (
            <div key={item._id} className="item-card">
              <img src={item.imageUrl} alt={item.name} className="item-image" />
              <h2>{item.name}</h2>
              <p>{item.description}</p>
              <p><strong>Price:</strong> Rs.{item.price}</p>
              <p><strong>Seller:</strong> {item.sellerID}</p>
              <button className="add-to-cart-button" onClick={() => handleAddToCart(item)}>
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Items;