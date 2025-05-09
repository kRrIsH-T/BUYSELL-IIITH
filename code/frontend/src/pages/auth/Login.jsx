import React, { useState } from "react";
import AltHeader from "../../components/Layout/altHeader";
import Footer from "../../components/Layout/Footer";
import "../styles/authstyles.css";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import {useAuth} from "../../context/auth.jsx";
import { toast } from "react-toastify";

const Login = () => {
  // State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const {auth,setAuth} = useAuth();

  // Validate iiit email
  const validateEmail = (email) => {
    const validDomains = [".iiit.ac.in"];
    return validDomains.some((domain) => email.endsWith(domain));
  };

  // Form handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      console.log("Invalid email:", email);
      toast.error("Invalid email");
      return;
    }

    // sending user data to database
    try {
      const userData = {
        email: email,
        password: password,
      };
      console.log("Sending to backend:", userData);

      const res = await axios.post(
        "http://localhost:8000/api/auth/login",
        userData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Full Response:", res);
      console.log("Response Data:", res.data);

      if (res.data.message == "User logged in successfully") {
        setAuth({...auth, user: res.data.user, token: res.data.token});
        localStorage.setItem("auth", JSON.stringify({user: res.data.user, token: res.data.token}));
        toast.success("Logged in successfully");
        navigate(location.state || "/dashboard");
      } else {
        toast.error("Invalid Credentials");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div>
      <AltHeader />
      <div className="auth-container">
          <h1>Login</h1>
        <div className="auth-form">
          <form onSubmit={handleSubmit}>
            E-mail:
            <div className="form-group">
              <input
                type="text"
                placeholder="Enter your e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                required
              />
            </div>
            Password:
            <div className="form-group">
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                required
              />
            </div>
            {error && <div className="error-message">{error}</div>}
            <div className="form-group">
              <button type="submit" className="register-button">
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
