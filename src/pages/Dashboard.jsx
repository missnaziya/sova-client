import "./css/Dashboard.css";
import img1 from "../assets/admin/img1.png";
import img2 from "../assets/admin/img2.png";
import { useEffect, useState } from "react";

const Dashboard = ({ fullName  , profile}) => {
  const [name, setName] = useState(fullName);

  useEffect(() => {
    setName(fullName);
  }, [fullName]);
  return (
    <section className="dashboard-section">
      <div className="container dashboard-container">
        <div className="dashboard-head">
          <h1>
            Hello,{" "}
            <span className="username">
             {profile?.f_name} {profile?.l_name}
            </span>
          </h1>
          <p>Welcome to your Profile New Design</p>
        </div>
        <div className="row cards-container">
          <div className="col-12 col-lg-6 col-xl-6 col-xxl-4  ">
            <div className="card">
              <div className="icon-container">
                <img src={img1} alt="Total Designs Icon" className="icon1" />
              </div>
              <h3>Total Designs</h3>
              <p className="count">8</p>
            </div>
          </div>

          <div className="col-12 col-lg-6 col-xl-6 col-xxl-4">
            <div className="card">
              <div className="icon-container">
                <img
                  src={img2}
                  alt="Delivered Designs Icon"
                  className="icon1"
                />
              </div>
              <h3>Delivered Designs</h3>
              <p className="count">5</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
