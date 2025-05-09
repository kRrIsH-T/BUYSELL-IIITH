import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { AuthProvider } from "./context/auth.jsx";
import { CartProvider } from "./context/cartcontext.jsx";
import {ToastContainer} from "react-toastify";
createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <CartProvider>
      <BrowserRouter>
        <App />
        <ToastContainer />
      </BrowserRouter>
    </CartProvider>
  </AuthProvider>
);
