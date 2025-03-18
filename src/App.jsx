import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import Sidebar from "./pages/navigation/sidebar";
import { useState } from "react";
import Dashboard from "./pages/dashboard/Dashboard.jsx";
import Post from "./pages/post/Berita.jsx";
import Users from "./pages/users/Users.jsx";
import Settings from "./pages/setting/Settings.jsx";
import HelpCenter from "./pages/helpcenter/helpCenter.jsx";
import Add from "./pages/post/addPost.jsx";
import EditPost from "./pages/post/editPost.jsx";
import Layanan from "./pages/layanan/Layanan.jsx";
import Slider from "./pages/slider/Slider.jsx";
import { Toaster } from "react-hot-toast";
import RegisterPage from "./pages/auth/registerPgae.jsx";
import LoginPage from "./pages/auth/loginPage.jsx";
import OtpForm from "./pages/OTPForm/OtpForm.jsx";
import ResendOtp from "./pages/ResendOTP/ResendOtp.jsx";

// Komponen Layout untuk rute yang memerlukan sidebar
const MainLayout = () => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className="flex">
      {/* Sidebar tetap fixed */}
      <div
        className={`fixed h-screen transition-all ${isOpen ? "w-64" : "w-20"}`}
      >
        <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
      </div>

      {/* Konten Utama */}
      <div
        className={`flex-1 ${
          isOpen ? "ml-64" : "ml-20"
        } transition-all p-10 bg-gray-50`}
      >
        <Outlet /> {/* Ini akan merender child route */}
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Rute Autentikasi */}
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-otp" element={<OtpForm />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/resend-otp" element={<ResendOtp />} />

        {/* Rute dengan Layout Utama */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/post" element={<Post />} />
          <Route path="/slider" element={<Slider />} />
          <Route path="/users" element={<Users />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/add-post" element={<Add />} />
          <Route path="/edit-post/:id" element={<EditPost />} />
          <Route path="/layanan" element={<Layanan />} />
        </Route>
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
