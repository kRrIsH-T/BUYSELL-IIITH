import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/auth.jsx";
import Layout from "../components/Layout/Layout.jsx";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles/listingform.css";

const ListingForm = ({ onClose }) => {
  const { auth } = useAuth();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [category, setCategory] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newItem = {
        name,
        description,
        price,
        imageUrl,
        category,
        sellerID: auth.user.email,
      };
      const res = await axios.post("http://localhost:8000/api/items", newItem, {
        headers: { "Content-Type": "application/json" },
      });
      // console.log(res.data);
      if (res.data) {
        toast.success("Listing created successfully");
        handleCloseForm();
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error creating listing");
    }
  };

  const handleCloseForm = () => {
    setName("");
    setDescription("");
    setPrice("");
    setImageUrl("");
    setCategory("");
    if (onClose) {
      onClose();
    }
  };

  return (
    <Layout>
      <div className="create-listing-form">
        <h2>Create Listing</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Description:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Price:</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Image URL:</label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Category:</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="create-button">
            Create
          </button>
          <button
            type="button"
            className="cancel-button"
            onClick={handleCloseForm}
          >
            Cancel
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default ListingForm;