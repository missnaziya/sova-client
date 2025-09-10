import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import mobile from "../../assets/admin/mobile.png";
import dashboard from "../../assets/admin/dashboard.png";
import person from "../../assets/admin/person.png";
import clipboard from "../../assets/admin/clipboard.png";
import settings from "../../assets/admin/settings.png";
import store from "../../assets/admin/store.png";
import help from "../../assets/admin/help.png";
import logout from "../../assets/admin/logout.png";
import design from "../../assets/admin/design.png";
import playstore from "../../assets/admin/playstore.png";
import apple from "../../assets/admin/apple.png";

import Dashboard from "../../pages/Dashboard";
import PersonalDetails from "../../pages/PersonalDetails";
import Shop from "../../pages/Shop";
import Order from "../../pages/Order";
import Settings from "../../pages/Settings";
import Help from "../../pages/Help";

import { fetchProfile, updateProfile } from "../../apis/authApis/personaDetailsApi";
import { FaUpload } from "react-icons/fa";
import { SuccessToaster } from "../../utils/toaster";

import "./Admin.css";

const AdminSidebar = ({ toggleComponent , profile, setProfile }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  console.log(profile , "profile sidebar")
  // Helper to convert file to base64
  const convertToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleMenuClick = (route) => {
    toggleComponent(route);
    navigate(route);
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedImage(URL.createObjectURL(file));
    setLoading(true);

    try {
      const base64Image = await convertToBase64(file);
      const payload = { image: base64Image};
      await updateProfile(payload);
      // After update, re-fetch profile to sync UI
      await fetchProfileData();
    } catch (error) {
      console.error("Update Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfileData = async () => {
    setLoading(true);
    try {
      const response = await fetchProfile();
      const items = response?.data?.profile || {};

      setSelectedImage(items?.image || "");
      setFirstName(items?.f_name || "");
      setLastName(items?.l_name || "");
      setProfile(items);

    } catch (error) {
      console.error("Error fetching profile data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  return (
    <div className="Admin_sidebar">
      <div className="profile-section">
        <label className="img-label" htmlFor="profileUpload">
          {selectedImage ? (
            <img src={selectedImage} alt="Profile" className="profile-img" style={{ cursor: "pointer" }} />
          ) : firstName && lastName ? (
            <div className="profile-initials">
              {firstName[0]}
              {lastName[0]}
            </div>
          ) : (
            <FaUpload className="profile-upload-icon" size={40} style={{ cursor: "pointer", color: "#666" }} />
          )}
        </label>

        <input
          id="profileUpload"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: "none" }}
          disabled={loading}
        />

        <h6 className="upload-img">Upload image</h6>
        <h3>Welcome</h3>
        <h2 className="Username pb-3">{profile?.f_name} {profile?.l_name}</h2>
      </div>

      <ul className="menu">
        {[
          { route: "/user/dashboard", icon: dashboard, label: "Dashboard" },
          { route: "/user/personal-details", icon: person, label: "Personal Details" },
          { route: "/user/shop", icon: store, label: "My Shop Design" },
          { route: "/user/order", icon: clipboard, label: "My Order" },
          { route: "/user/settings", icon: settings, label: "Settings" },
          { route: "/user/help", icon: help, label: "Help" },
        ].map(({ route, icon, label }) => (
          <li key={route} onClick={() => handleMenuClick(route)}>
            <img src={icon} alt={label} className="icon" />
            <span>{label}</span>
          </li>
        ))}

        <li
          onClick={() => {
            localStorage.removeItem("sovaToken");
            navigate("/");
            SuccessToaster("You are logout");
          }}
        >
          <img src={logout} alt="Logout" className="icon" />
          <span>Logout</span>
        </li>
      </ul>

      <div className="mobile-app">
        <div className="mobile-app-image">
          <img src={mobile} alt="Mobile App" />
        </div>
        <div className="mobile-app-info">
          <p>Get Mobile App</p>
          <div className="store-icons">
            <img src={playstore} alt="Play Store" />
            <img src={apple} alt="Apple Store" />
          </div>
        </div>
      </div>
    </div>
  );
};

const Admin = () => {
  const [activeComponent, setActiveComponent] = useState("/user/content");

  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();
  console.log(profile , "profile admin")

  const toggleComponent = (route) => setActiveComponent(route);

  const renderComponent = () => {
    switch (activeComponent) {
      case "/user/dashboard":
        return <Dashboard profile={profile} />;
      case "/user/personal-details":
        return <PersonalDetails setProfile={setProfile} />;
      case "/user/shop":
        return <Shop />;
      case "/user/order":
        return <Order />;
      case "/user/settings":
        return <Settings />;
      case "/user/help":
        return <Help />;
      default:
        return (
          <div className="content">
            <main>
              <h2>{profile?.f_name} {profile?.l_name}</h2>
              <h4>Welcome to your Profile New Design</h4>
              <div className="profile-container">
                <div className="profile-preview">
                  <img className="img-fluid" src={design} alt="Design" />
                </div>
                <div className="profile-buttons">
                  <button className="btn-edit">Edit Design</button>
                  <button onClick={() => navigate("/dashboard")} className="btn-create">
                    Create a New Design
                  </button>
                </div>
              </div>
            </main>
          </div>
        );
    }
  };

  return (
    <section className="admin-section py-5">
      <div className="container">
        <div className="row admin-container">
          <div className="col-12 col-md-4 col-xl-3 col-xxl-3">
            <AdminSidebar
              setProfile={setProfile}
              profile={profile}
              toggleComponent={toggleComponent}
         
            />
          </div>
          <div className="col-12 col-md-8 col-xl-9 col-xxl-9 content-area">{renderComponent()}</div>
        </div>
      </div>
    </section>
  );
};

export default Admin;
