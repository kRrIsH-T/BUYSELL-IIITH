import React, { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout.jsx";
import { useAuth } from "../context/auth.jsx";
import axios from "axios";
import "./styles/authstyles.css";

const Dashboard = () => {
  const { auth } = useAuth();
  const [userDetails, setUserDetails] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/users/details`, {
          params: { email: auth.user.email },
        });
        console.log(res.data);
        setUserDetails(res.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    if (auth.user) {
      fetchUserDetails();
    }
  }, [auth.user]);

  const handleSave = (updatedDetails) => {
    setUserDetails(updatedDetails);
    localStorage.setItem("userDetails", JSON.stringify(updatedDetails));
    setIsEditing(false);  
  };

  console.log("Dashboard Auth:", auth); // Debug log
  console.log("User Details:", userDetails); // Debug log

  return (
    <Layout>
      <div className="auth-container">
        {userDetails && (
          <div className="user-details">
            {isEditing ? (
              <EditDetails userDetails={userDetails} onSave={handleSave} />
            ) : (
              <>
                <h1 className="welcome-text">Welcome, {userDetails.username}</h1>
                <p><strong>Email:</strong> {userDetails.email}</p>
                <p><strong>Username:</strong> {userDetails.username}</p>
                <p><strong>Contact no:</strong> {7906262657}</p>
                <p><strong>Age:</strong> {19}</p>
                <button className="edit-button" onClick={() => setIsEditing(true)}>
                  Edit Details
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;