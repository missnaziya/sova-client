import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/Logo_blue.svg";
import "./Navbar.css";
import { headerApi } from "../../apis/authApis/headerApi";
import {  SuccessToaster } from "../../utils/toaster";
import languageIcon from "../../assets/Language.png";
import turkey from "../../assets/turkey-flag.png";
import { FaTimes } from "react-icons/fa";
import { FaBars } from "react-icons/fa6";
import { FaRegCircleUser } from "react-icons/fa6";



const Navbar = () => {
  const navigate = useNavigate();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [headerData, setHeaderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedLang, setSelectedLang] = useState("en");
  const [showLangOptions, setShowLangOptions] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);
  const toggleLanguageDropdown = () => setShowLangOptions((prev) => !prev);

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
    setShowLangOptions(false);
  };

  const handleLanguageChange = (lang) => {
    setSelectedLang(lang);
    setShowLangOptions(false);
  };

  const fetchHeaderData = async () => {
    try {
      const response = await headerApi();
      setHeaderData(response.data.header?.[0] || {});
    } catch (error) {
      console.error("Error fetching header data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHeaderData();
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setShowLangOptions(false);
  }, [location.pathname]);

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <section className="nav1-section">
        <div className="container">
          <div className="row navbar-row-icon">
            <div className="col-9">
              <ul className="list-unstyled d-flex navbar-social-icons">
                {headerData?.socialIcons?.map((item, index) => (
                  <li key={index} className="icon-gap">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img src={item.icon} alt={item.name} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-3 language">
              <div className="language-selector">
                <div
                  className="language-button"
                  onClick={toggleLanguageDropdown}
                >
                  <img
                    src={selectedLang === "en" ? languageIcon : turkey}
                    alt="Language"
                    className="language-icon"
                  />
                  <span className="ml-2 lang-name">
                    {selectedLang === "en" ? "English" : "Turkish"}
                  </span>
                </div>
                {showLangOptions && (
                  <ul className="custom-language-dropdown">
                    {selectedLang !== "en" && (
                      <li onClick={() => handleLanguageChange("en")}>
                        English
                      </li>
                    )}
                    {selectedLang !== "tr" && (
                      <li onClick={() => handleLanguageChange("tr")}>
                        Turkish
                      </li>
                    )}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="nav-section">
        <div className="container">
          <div className="row navbar">
            <div className="col-4 col-lg-1 col-xl-1 col-md-2 navbar-logo">
              <img
                className="img-fluid"
                onClick={() => handleNavigation("/")}
                src={headerData?.logo || logo}
                alt={headerData?.title || "Logo"}
              />
            </div>

            <div
              className={`col-3 col-lg-9 col-xl-9 col-md-3 navbar-links ${
                isMobileMenuOpen ? "active" : ""
              }`}
            >
              <ul>
                {headerData?.navLinks?.map((item, index) => (
                  <li key={index} onClick={() => handleNavigation(item.url)}>
                    {item.name}
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-6 col-lg-2 col-xl-2 col-md-3 navbar-btn">
              {localStorage.getItem("sovaToken") && (
                <div onClick={() => navigate("user")} className="user-main">

                  <FaRegCircleUser />
                </div>
              )}

              <ul>
                {localStorage.getItem("sovaToken") ? (
                  <li
                    onClick={() => {
                      localStorage.removeItem("sovaToken");
                      handleNavigation("/");
                      SuccessToaster("You are logout");
                    }}
                  >
                    <button className="btn-sign-up">Logout</button>
                  </li>
                ) : (
                  <li onClick={() => handleNavigation("/signin")}>
                    <button className="btn-sign-in">Sign In</button>
                  </li>
                )}
              </ul>

              <div className="mobile-menu-icon" onClick={toggleMobileMenu}>
                {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Navbar;
