import React from "react";
import { NavLink, Link} from "react-router-dom";
import {useAuth} from "../../context/auth.jsx";
const Header = () => {
  const {auth, setAuth} = useAuth();
  const logout = () => {
    setAuth({
      ...auth,
      token: "",
      user: null
    })
    localStorage.removeItem("auth");};
    return(
        // const logout - () => {
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <Link to="/" className="navbar-brand">BuySell@IIITH</Link>
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink to="/" className="nav-link " aria-current="page">Home</NavLink>
              </li>
              
              <li className="nav-item">
                <NavLink to="/search" className="nav-link">Search</NavLink>
              </li>
             
              <li className="nav-item">
                <NavLink to="/sell" className="nav-link">Sell</NavLink>
              </li>

              <li className="nav-item">
                <NavLink to="/Items" className="nav-link">Items</NavLink>
              </li>

              <li className="nav-item">
                <NavLink to="/History" className="nav-link">Order History</NavLink>
              </li>
              
              <li className="nav-item">
                <NavLink to="/deliveritems" className="nav-link">Deliver Items</NavLink>
              </li>

              <li className="nav-item">
                <NavLink to="/Cart" className="nav-link">My Cart</NavLink>
              </li>
              
              <li className="nav-item">
                <NavLink to="/support" className="nav-link">Support</NavLink>
              </li>

              <li className="logout">
                <div>
                <NavLink onClick = {logout} to="/" className="nav-link">Logout</NavLink>
                </div>
              </li>
                  
            </ul>
          </div>
        </div>
      </nav>
    );
};
export default Header;