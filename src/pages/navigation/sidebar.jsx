import { useState, useEffect } from "react";
import {
  Home,
  Users,
  Images,
  ChevronLeft,
  ChevronRight,
  Grid2x2,
  X,
  Headset,
} from "lucide-react";
import MenuItem from "../../components/menuItems/menuItem";
import PropTypes from "prop-types";
import logo from "../../assets/logo-kota-semarang.png";
import { me, logoutUser } from "../../utils/data/authAPI";
import userImg from "../../assets/user.png";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const [activeItem] = useState("Dashboard");
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await me();
        setUserData(data);
      } catch (error) {
        console.error("Gagal mengambil data pengguna:", error);
      }
    };

    fetchUserData();
  }, []);

  const menuItems = [
    { name: "Dashboard", icon: <Home size={20} />, path: "/" },
    { name: "Berita", icon: <Grid2x2 size={20} />, path: "/post" },
    { name: "Slider", icon: <Images size={20} />, path: "/slider" },
    { name: "Layanan", icon: <Headset size={20} />, path: "/layanan" },
    { name: "Users", icon: <Users size={20} />, path: "/users" },
  ];

  const handleAvatarClick = () => {
    setIsAvatarModalOpen((prevState) => !prevState);
  };

  const handleLogout = async () => {
    try {
      await logoutUser(); // Panggil fungsi logoutUser dari authAPI
      navigate("/login"); // Arahkan pengguna ke halaman /login setelah logout berhasil
    } catch (error) {
      console.error("Gagal melakukan logout:", error);
    }
  };

  return (
    <div
      className={`relative flex flex-col h-screen bg-white border-r border-gray-200 shadow-md ${
        isOpen ? "w-64" : "w-20"
      } transition-all`}
    >
      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="absolute top-4 -right-5 bg-gray-100 text-gray-700 p-2 rounded-full shadow hover:bg-gray-200"
      >
        {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </button>

      {/* Logo Section */}
      <div className="flex items-center justify-center py-4 px-4">
        {isOpen ? (
          <div className="flex items-center space-x-2">
            <img src={logo} alt="Logo" className="w-8 h-auto" />
            <span className="text-lg font-bold text-font1">Admin Panel</span>
          </div>
        ) : (
          <img src={logo} alt="Logo" className="w-8 h-auto" />
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 mx-4"></div>

      {/* Menu Items */}
      <ul className="flex-1 px-2 space-y-2 mt-5 text-sm">
        {menuItems.map((item, index) => (
          <MenuItem
            key={index}
            name={item.name}
            icon={item.icon}
            isActive={activeItem === item.name}
            isOpen={isOpen}
            path={item.path}
          />
        ))}
      </ul>

      {/* Divider */}
      <div className="border-t border-gray-200 mx-4"></div>

      {/* User Section */}
      <div className="flex items-center p-5">
        <div className="relative">
          <img
            src={userData.avatar || userImg}
            alt="User Avatar"
            className="w-10 h-10 rounded-full cursor-pointer"
            onClick={handleAvatarClick}
          />

          {isAvatarModalOpen && (
            <div className="absolute -bottom-0 left-0 w-56 bg-white border shadow-md rounded-md p-4 z-10">
              <div className="flex items-center space-x-2">
                <img
                  src={userData.avatar || userImg}
                  alt="User Avatar"
                  className="w-10 h-10 rounded-full cursor-pointer"
                />
                <div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-700">
                      {userData.username || "irfaneka"}
                    </p>
                    <X
                      size={18}
                      className="cursor-pointer text-gray-600 hover:text-gray-800 absolute top-2 right-2"
                      onClick={() => setIsAvatarModalOpen(false)}
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    {userData.email || "irfan@example.com"}
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <button
                  onClick={handleLogout}
                  className="bg-red-100 text-red-600 w-full py-1.5 rounded text-sm"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>

        {isOpen && (
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-700">
              {userData.username || "username"}
            </p>
            <p className="text-xs text-gray-500">
              {userData.email || "email@example.com"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

Sidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggleSidebar: PropTypes.func.isRequired,
};

export default Sidebar;
