import React, { useState, useEffect } from 'react';
import { useAuth } from "../context/auth.jsx";
import Layout from "../components/Layout/Layout.jsx";
import axios from "axios";
import { toast } from "react-toastify";
import './styles/deliveritems.css';

const DeliverItems = () => {
  const { auth } = useAuth();
  const [orders, setOrders] = useState([]);
  const [otps, setOtps] = useState({}); // Separate OTP state for each order

  useEffect(() => {
    if (auth.user) {
      fetchOrders();
    }
  }, [auth.user]);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/api/orders/sold/${auth.user.email}`);
      setOrders(res.data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };

  const handleVerifyOtp = async (orderId) => {
    try {
      const otp = otps[orderId];
      const res = await axios.post("http://localhost:8000/api/orders/verify-otp", { orderId, otp });
      toast.success(res.data.message);

      // Remove the verified order from the orders state
      setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));

      // Clear the OTP input for the verified order
      setOtps((prevOtps) => {
        const newOtps = { ...prevOtps };
        delete newOtps[orderId];
        return newOtps;
      });
    } catch (error) {
      console.error("Failed to verify OTP:", error);
      toast.error("Invalid OTP. Please try again.");
    }
  };

  return (
    <Layout>
      <div className="deliver-items-container">
        <h1>Deliver Items</h1>
        {orders.length === 0 ? (
          <p>No orders to deliver</p>
        ) : (
          orders.map((order) => (
            <div key={order._id} className="order-card">
              <h3>Order ID: {order._id}</h3>
              <p>Buyer: {order.buyerID}</p>
              <p>Total Amount: Rs.{order.totalAmount}</p>
              <div className="order-items">
                {order.items.map((item) => (
                  <div key={item._id} className="order-item">
                    <img src={item.imageUrl} alt={item.name} />
                    <div className="item-details">
                      <h4>{item.name}</h4>
                      <p>Price: Rs.{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
              <input  
                type="text"
                placeholder="Enter OTP"
                value={otps[order._id] || ""}
                onChange={(e) => setOtps((prevOtps) => ({
                  ...prevOtps,
                  [order._id]: e.target.value
                }))}
              />
              <button onClick={() => handleVerifyOtp(order._id)}>Verify OTP</button>
            </div>
          ))
        )}
      </div>
    </Layout>
  );
};

export default DeliverItems;