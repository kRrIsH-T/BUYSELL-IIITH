import React, { useState, useEffect } from 'react';
import { useAuth } from "../context/auth.jsx";
import Layout from "../components/Layout/Layout.jsx";
import axios from "axios";
import CryptoJS from "crypto-js";
import { Tabs, Tab } from 'react-bootstrap';
import './styles/orderhistory.css';

const OrderHistory = () => {
  const { auth } = useAuth();
  const [pendingOrders, setPendingOrders] = useState([]);
  const [boughtItems, setBoughtItems] = useState([]);
  const [soldItems, setSoldItems] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');

  useEffect(() => {
    if (auth.user) {
      fetchOrders();
    }
  }, [auth.user]);

  const fetchOrders = async () => {
    try {
      // Fetch pending orders
      const pendingRes = await axios.get(`http://localhost:8000/api/orders/pending/${auth.user.email}`);
      setPendingOrders(pendingRes.data); // The backend will send decrypted OTPs

      // Fetch bought items
      const boughtRes = await axios.get(`http://localhost:8000/api/orders/bought/${auth.user.email}`);
      setBoughtItems(boughtRes.data); // The backend will send decrypted OTPs

      // Fetch sold items
      const soldRes = await axios.get(`http://localhost:8000/api/orders/sold/${auth.user.email}`);
      setSoldItems(soldRes.data); // The backend will send decrypted OTPs
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };

  return (
    <Layout>
      <div className="order-history-container">
        <h1>Order History</h1>
        <Tabs
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
          className="mb-3"
        >
          <Tab eventKey="pending" title="Pending Orders">
            {pendingOrders.map((order) => (
              <div key={order._id} className="order-card pending">
                <h3>Order ID: {order._id}</h3>
                <p>Total Amount: Rs.{order.totalAmount}</p>
                <p>Status: {order.status}</p>
                <p>OTP: {order.otp}</p>
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
              </div>
            ))}
          </Tab>

          <Tab eventKey="bought" title="Purchased Items">
            {boughtItems.map((order) => (
              <div key={order._id} className="order-card">
                <h3>Order ID: {order._id}</h3>
                <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                <p>Total Amount: Rs.{order.totalAmount}</p>
                <p>Status: {order.status}</p>
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
              </div>
            ))}
          </Tab>

          <Tab eventKey="sold" title="Sold Items">
            {soldItems.map((order) => (
              <div key={order._id} className="order-card">
                <h3>Order ID: {order._id}</h3>
                <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                <p>Total Amount: Rs.{order.totalAmount}</p>
                <p>Status: {order.status}</p>
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
              </div>
            ))}
          </Tab>
        </Tabs>
      </div>
    </Layout>
  );
};

export default OrderHistory;