import { useState, useEffect } from "react";
import { useAuth } from "../../context/auth.jsx";
import axios from "axios";
import { Outlet, Navigate } from "react-router-dom";

export default function PrivateRoute() {
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(true);
  const { auth } = useAuth();

  useEffect(() => {
    const authCheck = async () => {
      try {
        // Check if we have a token
        if (!auth?.token) {
          setOk(false);
          setLoading(false);
          return;
        }

        // Log token for debugging
        console.log("Token being sent:", auth.token);

        const res = await axios.get("http://localhost:8000/api/auth/user-auth", {
          headers: {
            "Authorization": auth.token
          }
        });

        if (res.data.ok) {
          setOk(true);
        } else {
          setOk(false);
        }
      } catch (error) {
        console.error("Auth check failed:", error.response?.data || error.message);
        setOk(false);
      } finally {
        setLoading(false);
      }
    };

    authCheck();
  }, [auth?.token]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return ok ? <Outlet /> : <Navigate to="/" replace />;
}