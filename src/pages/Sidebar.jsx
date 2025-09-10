import { useNavigate, Outlet } from "react-router-dom";
import DrawingTool from "../assets/DrawingTool.png";
import Model1 from "../assets/Model.png";
import Rendering1 from "../assets/Rendering.png";
import Autosave1 from "../assets/Autosave.png";
import Export1 from "../assets/Export.png";
import './css/Sidebar1.css';

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <div className="sidebar-grid">
      <img src={DrawingTool} alt="Drawing Tool" className="img-fluid icon-side" onClick={() => navigate("shopdesign")} />
      {/* <img src={Model1} alt="Model" className="img-fluid icon-side" onClick={() => navigate("model")} /> */}
      {/* <img src={Rendering1} alt="Rendering" className="img-fluid icon-side" onClick={() => navigate("render")} /> */}
      {/* <img src={Autosave1} alt="Autosave" className="img-fluid icon-side" onClick={() => navigate("autosave")} /> */}
      {/* <img src={Export1} alt="Export" className="img-fluid icon-side" onClick={() => navigate("export")} /> */}
    </div>
  );
};
const Sidebar1 = () => {
  return (
    <section className="canvas-section">
      <div className="full-screen-container">
        <div className="outlet-content">
          <Outlet />
        </div>
        <div className="sidebar-overlay">
          <Sidebar />
        </div>
      </div>
    </section>
  );
};


export default Sidebar1;
