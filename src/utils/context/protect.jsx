import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import axios from "axios";

import { HashLoader } from "react-spinners";

const API_URL = "http://localhost:5000/api/v1/user"; // Ganti dengan URL backend Anda

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null untuk status awal (loading)
  const location = useLocation(); // Mendapatkan lokasi halaman saat ini

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if user is authenticated by sending a request to the server
        await axios.get(`${API_URL}/me`, { withCredentials: true });
        setIsAuthenticated(true); // If request is successful, user is authenticated
      } catch (error) {
        setIsAuthenticated(false); // If failed, user is not authenticated
        console.error("Error checking authentication:", error);
      }
    };

    checkAuth();
  }, []); // Dependency array is empty, so this runs once on component mount

  // Tampilkan spinner atau indikator loading saat status autentikasi sedang diperiksa
  if (isAuthenticated === null) {
    return (
      <div className="h-full fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 items-center justify-center bg-black bg-opacity-50 w-full flex z-50">
        <HashLoader color="#C0392B" size={50} />
      </div>
    );
  }

  // Jika cookie terhapus atau pengguna tidak terautentikasi, redirect ke halaman login
  if (!isAuthenticated && location.pathname !== "/login") {
    return <Navigate to="/login" replace />;
  }

  // Jika pengguna sudah terautentikasi dan mencoba mengakses halaman login, redirect ke halaman utama
  if (isAuthenticated && location.pathname === "/login") {
    return <Navigate to="/" replace />;
  }

  // Jika pengguna terautentikasi, render komponen yang dilindungi
  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
