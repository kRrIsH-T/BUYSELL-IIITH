import React, { useState } from "react";
import { useCart } from "../context/cartcontext.jsx";
import { useAuth } from "../context/auth.jsx";
import axios from "axios";
import { toast } from "react-toastify";
import Layout from "../components/Layout/Layout.jsx";
import "./styles/cart.css";

const Cart = () => {
  const { cart, removeFromCart, clearCart } = useCart();
  const { auth } = useAuth();
  const [loading, setLoading] = useState(false);

  const generateOTP = () => {
    return Math.floor(1000 + Math.random() * 9000);
  };

  const handleCheckout = async () => {
    try {
      setLoading(true);
      
      const itemsBySeller = cart.reduce((acc, item) => {
        if (!acc[item.sellerID]) {
          acc[item.sellerID] = [];
        }
        acc[item.sellerID].push(item);
        return acc;
      }, {});

      const orderPromises = Object.entries(itemsBySeller).map(async ([sellerID, items]) => {
        const otp = generateOTP();
        
        const orderData = {
          buyerID: auth.user.email,
          sellerID: sellerID,
          items: items,
          totalAmount: items.reduce((sum, item) => sum + item.price, 0),
          status: "pending",
          otp: otp.toString()
        };

        return axios.post("http://localhost:8000/api/orders", orderData, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
      });

      await Promise.all(orderPromises);
      clearCart(); // Clear the cart after successful order
      toast.success("Order placed successfully!");

    } catch (error) {
      console.error("Checkout failed:", error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="cart-container">
        <h1>My Cart</h1>
        {cart.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          <>
            <div className="cart-items">
              {cart.map((item) => (
                <div key={item._id} className="cart-item">
                  <img src={item.imageUrl} alt={item.name} />
                  <div className="item-details">
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                    <p>Price: Rs.{item.price}</p>
                    <p>Seller: {item.sellerName}</p>
                    <button 
                      className="remove-button"
                      onClick={() => {
                        removeFromCart(item._id);
                        toast.success("Item removed from cart");
                      }}
                    >
                      Remove from Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="cart-summary">
              <h3>Total: Rs.{cart.reduce((sum, item) => sum + item.price, 0)}</h3>
              <button 
                className="checkout-button" 
                onClick={handleCheckout}
                disabled={loading}
              >
                {loading ? "Processing..." : "Place Order"}
              </button>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Cart;