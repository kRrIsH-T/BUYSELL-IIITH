import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout/Layout';
import { useCart } from '../context/cartcontext';
import { toast } from 'react-toastify';
import './styles/itemdetail.css';

const ItemDetail = () => {
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();  // Changed from _id to id to match route parameter
  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    fetchItem();
  }, [id]);  // Changed dependency from _id to id

  const fetchItem = async () => {
    try {
      console.log(`Fetching item with id: ${id}`);  // Debug log
      const response = await axios.get(`http://localhost:8000/api/items/${id}`);
      setItem(response.data);
    } catch (error) {
      console.error('Failed to fetch item:', error);
      toast.error('Failed to load item details');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    addToCart(item);
    toast.success('Added to cart!');
  };

  if (loading) {
    return (
      <Layout>
        <div className="loading">Loading...</div>
      </Layout>
    );
  }

  if (!item) {
    return (
      <Layout>
        <div className="error">Item not found</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="item-detail-container">
        <div className="item-image">
          <img src={item.imageUrl} alt={item.name} />
        </div>
        <div className="item-info">
          <h1>{item.name}</h1>
          <p className="price">Rs. {item.price}</p>
          <p className="seller">Seller: {item.sellerID}</p>
          <p className="category">Category: {item.category}</p>
          <p className="description">{item.description}</p>
          <button className="add-to-cart" onClick={handleAddToCart}>
            Add to Cart
          </button>
          <button className="back" onClick={() => navigate(-1)}>
            Back
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default ItemDetail;