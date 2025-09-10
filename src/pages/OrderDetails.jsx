import "../pages/css/OrderDetails.css";
import bannerImg from "../assets/order-details-banner.jpg";
import { FaStar } from "react-icons/fa";
import slideImg from "../assets/slide-1.png";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import PropTypes from "prop-types";

import {
  FaHandPaper,
  FaListAlt,
  FaUserCheck,
  FaShippingFast,
  FaCheckCircle,
} from "react-icons/fa";
import { useState } from "react";

const steps = [
  { label: "Reqest Send", icon: <FaHandPaper />, active: true },
  { label: "Request Under Review", icon: <FaListAlt />, active: true },
  { label: "Request Approved", icon: <FaUserCheck />, active: true },
  { label: "Process", icon: <FaShippingFast />, active: false },
  { label: "Completed", icon: <FaCheckCircle />, active: false },
];

function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "block",
        border: "none",
        width: "40px",
        height: "40px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      onClick={onClick}
    />
  );
}

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "block",
        border: "none",
        width: "40px",
        height: "40px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      onClick={onClick}
    />
  );
}

const OrderDetails = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(null);
  return (
    <>
      <section className="order-details-banner">
        <div className="container order-banner-container">
          <img className="img-fluid" src={bannerImg} alt="img" />
        </div>
      </section>
      <section className="order-details-summary-section">
        <div className="container">
          <div className="order-details-heading">
            <h2>Order Details</h2>
          </div>
        </div>
        <div className="container">
          <div className=" row order-details-summary-main">
            <div className="col-md-3 order-id">
              <h6>Order ID</h6>
              <h3>#ORD-2024-1234</h3>
            </div>

            <div className="col-md-3 order-id">
              <h6>Order Date</h6>
              <h3>Jan 15, 2024</h3>
            </div>

            <div className="col-md-3 order-id">
              <h6>Total Amount</h6>
              <h3>$299.99</h3>
            </div>

            <div className="col-md-3 order-id">
              <h6>Payment Status</h6>
              <h3>
                <span>Completed</span>
              </h3>
            </div>
          </div>
        </div>
      </section>

      <section className="order-details-desc-section">
        <div className="container">
          <div className="order-details-heading desc-heading">
            <h2>Description </h2>
            <p>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book. It has
              survived not only five centuries, but also the leap into
              electronic typesetting, remaining essentially where there
              unchanged. Lorem Ipsum is simply dummy text of the printing and
              typesetting industry. Lorem Ipsum has been the industry's standard
              dummy text ever since the 1500s, when an unknown printer took a
              galley
            </p>
          </div>
        </div>
      </section>

      <section className="order-details-timeline-section">
        <div className="container">
          <div className="order-details-timeline-main">
            <h2>Delivery Status</h2>

            <div className="progress-container">
              {steps.map((step, index) => (
                <div className="step-item" key={index}>
                  <div className={`step-icon ${step.active ? "active" : ""}`}>
                    {step.icon}
                  </div>
                  {index !== steps.length - 1 && (
                    <div
                      className={`step-line ${
                        steps[index + 1].active ? "active" : ""
                      }`}
                    ></div>
                  )}
                  <p className="step-label">{step.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="timeline-btn-main">
            <button className="chat-btn">Chat With Us</button>
            <button className="invoice-btn">Download Invoice</button>
          </div>
        </div>
      </section>

      <section className="order-details-rating-section">
        <div className="container">
          <div className="order-details-heading">
            <h2>Rate This Product</h2>
            <p>
              Recently you bought 3d model from our store. What do you think
              about the product
            </p>
          </div>
        </div>
        <div className="container">
          <div className="rating-main-box">
            <div style={{ display: "flex", gap: "10px" }}>
              {[...Array(5)].map((star, index) => {
                const currentRating = index + 1;
                return (
                  <label key={index}>
                    <input
                      type="radio"
                      name="rating"
                      value={currentRating}
                      onClick={() => setRating(currentRating)}
                      style={{ display: "none" }}
                    />
                    <FaStar
                      size={30}
                      color={
                        currentRating <= (hover || rating) ? "#ffc107" : "#999"
                      }
                      style={{ cursor: "pointer" }}
                      onMouseEnter={() => setHover(currentRating)}
                      onMouseLeave={() => setHover(null)}
                    />
                  </label>
                );
              })}
            </div>
          </div>
          <div className="review-box-main">
            <h3>Your Review</h3>
            <div className="message-box">
              <form>
                <textarea
                  id="message"
                  placeholder="I Am Received The Products That I Ordered And I Am Very Happy ..."
                ></textarea>
                <button className="chat-btn" type="submit">
                  Submit Review
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="order-details-slider-section">
        <div className="container">
          <div className="slider-main-head">
            <h2>Similar Product Might be Also Interested</h2>
          </div>
          <div className="container">
            <div className="row">
              <Slider className="order-slider" {...settings}>
                {[1, 2, 3, 4, 5, 6].map((item, index) => (
                  <div key={index}>
                    <div className="order-details-slider-item">
                      <div className="order-details-slider-item-img">
                        <img src={slideImg} alt="img" />
                      </div>
                      <div className="slide-content">
                        <h4>Full 3D Modeling Room Isometric Design</h4>
                        <h3>$299.99</h3>
                      </div>
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
          </div>
        </div>
      </section>

      <section className="order-details-price">
        <div className="container">
          <div className="slider-main-head">
            <h2>Order Details</h2>
          </div>

          <div className="quote-box">
      <div className="quote-row">
        <span className="label">Subtotal</span>
        <span className="value">$ 800</span>
      </div>

      <hr />

      <div className="quote-row align-top">
        <span className="label">Shipping</span>
        <div className="shipping-options">
          <label className="radio-label">
           Flat rate: <strong>$ 50</strong>
            <input type="radio" name="shipping" defaultChecked />
            <span className="custom-radio"></span>
           
          </label>
          <label className="radio-label">
                  Local Pickup
            <input type="radio" name="shipping" />
            <span className="custom-radio"></span>
    
          </label>
          <span className="change-address">Change Address</span>
        </div>
      </div>

      <hr />

      <div className="quote-row">
        <span className="label">Total Price</span>
        <span className="value">$ 800</span>
      </div>

      <button className="quote-btn">Request For Quote</button>
    </div>
        </div>
      </section>
    </>
  );
};

export default OrderDetails;
