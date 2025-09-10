import React from "react";
import "./Mobile.css";
import PhoneImg from "../../assets/Phoneview.png";
import Google from "../../assets/Googleplay.png";
import AppStore from "../../assets/Appstore.png";

const Mobile = () => {
  return (
    <section className="mobile-container">
      <div className="container">
        <div className="row">
          <div className="text-section mobile-sec col-md-6  col-sm-12">
            <h1>
              The Best App to Modeling Your 3d Design
            </h1>
            <p>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book.
            </p>
            <div className="app-links">
            
                <div>
                <img src={Google} alt="Google Play" className="img-fluid img-play" />
                <img src={AppStore} alt="App Store" className="img-fluid img-apple" />
            
            
              </div>
            </div>
          </div>

          <div className="right-container1 col-md-6 phone-image col-sm-12">
            <img src={PhoneImg} alt="Phone Preview" className="img-fluid img-mob" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Mobile;
