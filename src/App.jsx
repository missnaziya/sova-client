import "./App.css";
import Navbar from "./Components/Navbar/Navbar";
import Footer from "./Components/Footer/Footer";

import Shelving from "./Components/Shelving/Shelving";
import Catalogue from "./Components/Catalogue/Catalogue";
import Mobile from "./Components/Mobile/Mobile";

import FAQ from "./Components/FAQ/Faq";
import Admin from "./Components/Admin/Admin";

import Login from "./Components/Login/Login";
import SignUp from "./Components/SignUp/SignUp";
import { Routes, Route, useLocation } from "react-router-dom";
import Sidebar1 from "./pages/Sidebar";
import "bootstrap/dist/css/bootstrap.min.css";
import { DrawingProvider } from "./context/DrawingContext";
import Home from "./pages/Home";
import PersonalDetails from "./pages/PersonalDetails";
import Page from "./pages/Page";
import Shopdesign from "./pages/Shopdesign";
import ModelSidebar from "./pages/ModelSidebar";
import Render from "./pages/Render";
import AutosaveSidebar from "./pages/AutosaveSidebar";
import ExportSidebar from "./pages/ExportSidebar";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import ProtectedRoute from "./ProtectedRoute";
import OrderDetails from "./pages/OrderDetails";

function App() {
  const isAuthenticated = localStorage.getItem("sovaToken");
  const location = useLocation();

  const hideNavbar =
    location.pathname === "/signin" ||
    location.pathname === "/signup" ||
    location.pathname.startsWith("/dashboard");

  const hideFooter =
    location.pathname === "/signin" ||
    location.pathname === "/signup" ||
    location.pathname.startsWith("/dashboard");

  return (
    <DrawingProvider>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/supermarkets" element={<Mobile />} />
        <Route path="/bespoke" element={<Catalogue />} />
        <Route path="/products" element={<Shelving />} />
        <Route path="/work" element={<Mobile />} />
        <Route path="/catalogue" element={<Catalogue />} />
        <Route path="/sova" element={<FAQ />} />
        <Route
          path="/order-details"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <OrderDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/*"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Admin />
            </ProtectedRoute>
          }
        />

        <Route path="/signin" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/personal-details" element={<PersonalDetails />} />
        <Route path="/shop-design" element={<Shopdesign />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/:slug" element={<Page />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Sidebar1 />
            </ProtectedRoute>
          }
        >
          <Route index element={<Shopdesign />} />
          <Route path="shopdesign" element={<Shopdesign />} />
          <Route path="model" element={<ModelSidebar />} />
          <Route path="render" element={<Render />} />
          <Route path="autosave" element={<AutosaveSidebar />} />
          <Route path="export" element={<ExportSidebar />} />
        </Route>
      </Routes>

      {!hideFooter && <Footer />}
    </DrawingProvider>
  );
}

export default App;
