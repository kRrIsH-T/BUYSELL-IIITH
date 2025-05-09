import React, { useState } from "react";
import AltHeader from "../../components/Layout/altHeader";
import Footer from "../../components/Layout/Footer";
import "../styles/authstyles.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import ReCAPTCHA from "react-google-recaptcha";

const RECAPTCHA_SITE_KEY = "6LfO1c8qAAAAAKSHY7APvfjMGWo9_haGZLx4vFeO"; 

const Register = () => {
  // State
  const [fname, setfName] = useState("");
  const [lname, setlName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [error, setError] = useState("");
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const navigate = useNavigate();

  // Validate iiit email
  const validateEmail = (email) => {
    const validDomains = [".iiit.ac.in"];
    return validDomains.some((domain) => email.endsWith(domain));
  };

  const handleRecaptcha = (token) => {
    setRecaptchaToken(token);
  };
  console.log(recaptchaToken)
  // Form handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      console.log("Invalid email:", email);
      toast.error("Invalid email");
      return;
    }

    if (!recaptchaToken) {
      toast.error("Please verify that you are not a robot");
      return;
    }

    try {
      const userData = {
        username: fname + " " + lname,
        email: email,
        password: password,
        phone: phone,
        age: age,
        recaptchaToken: recaptchaToken
      };
      console.log("Sending to backend:", userData);

      const res = await axios.post(
        "http://localhost:8000/api/auth/register",
        userData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.message === "User registered successfully") {
        toast.success("Registration Successful");
        // Save user details in local storage
        localStorage.setItem("userDetails", JSON.stringify(userData));
        navigate("/login");
      } else {
        console.log("Registration Failed:", res.data.error);
        toast.error(res.data.error || "Registration failed");
      }
    } catch (error) {
      console.error("Full Error:", error);
      console.error("Error Response:", error.response);
      console.error("Error Data:", error.response?.data);
      toast.error(error.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div>
      <AltHeader />
      <div className="auth-container">
        <h1>Register</h1>
        <form onSubmit={handleSubmit}>
          <div className="auth-form">
            First Name:
            <div className="form-group">
              <input
                type="text"
                placeholder="Enter your first name"
                value={fname}
                onChange={(e) => setfName(e.target.value)}
                className="form-input"
                required
              />
            </div>
            Last Name:
            <div className="form-group">
              <input
                type="text"
                placeholder="Enter your last name"
                value={lname}
                onChange={(e) => setlName(e.target.value)}
                className="form-input"
                required
              />
            </div>
            Age:
            <div className="form-group">
              <input
                type="text"
                placeholder="Enter your age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="form-input"
                required
              />
            </div>
            Contact no:
            <div className="form-group">
              <input
                type="text"
                placeholder="Enter your Contact no."
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="form-input"
                required
              />
            </div>
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
            <div className="form-group">
              <ReCAPTCHA
                sitekey={RECAPTCHA_SITE_KEY}
                onChange={handleRecaptcha}
              />
            </div>
            {error && <div className="error-message">{error}</div>}
            <div className="form-group">
              <button type="submit" className="register-button">
                Register
              </button>
            </div>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default Register;