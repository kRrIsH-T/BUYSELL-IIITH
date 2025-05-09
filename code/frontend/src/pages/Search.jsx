import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout.jsx';
import axios from 'axios';
import './styles/search.css';

const Search = () => {
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const navigate = useNavigate();

  // Fetch all items and categories on component mount 
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/items');
      setItems(response.data);
      
      // Extract unique categories
      const categories = [...new Set(response.data.map(item => item.category))];
      setAllCategories(categories);
    } catch (error) {
      console.error('Failed to fetch items:', error);
    }
  };

  // Filter items based on search query and selected categories
  const filteredItems = items.filter(item => {
    const matchesSearch = searchQuery === '' || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategories = selectedCategories.length === 0 || 
      selectedCategories.includes(item.category);

    return matchesSearch && matchesCategories;
  });

  // Handle category selection
  const handleCategoryChange = (category) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  // Navigate to item detail page
  const handleItemClick = (itemId) => {
    navigate(`/item/${itemId}`);
  };

  return (
    <Layout>
      <div className="search-container">
        <div className="search-header">
          <input
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="search-content">
          <div className="filter-sidebar">
            <h3>Categories</h3>
            {allCategories.map(category => (
              <label key={category} className="category-checkbox">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                  onChange={() => handleCategoryChange(category)}
                />
                {category}
              </label>
            ))}
          </div>

          <div className="items-grid">
            {filteredItems.map(item => (
              <div 
                key={item._id} 
                className="item-card"
                onClick={() => handleItemClick(item._id)}
              >
                <img src={item.imageUrl} alt={item.name} />
                <div className="item-details">
                  <h3>{item.name}</h3>
                  <p className="price">Rs. {item.price}</p>
                  <p className="seller">Seller: {item.sellerID}</p>
                  <p className="category">Category: {item.category}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Search;