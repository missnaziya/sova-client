import { useState } from "react";
import "./css/Order.css";
import texture from "../assets/texture.png"
import { useNavigate } from "react-router-dom";


const orders = [


  {
    status: "Delivered",
    statusClass: "delivered",
    date: "14/05/2025 10:50am",
    orderNo: "5123456789789456",
    title: "Home With Full Texture Isometric Room",
    price: "$299",
    qty: 1,
    img: texture
  },
  {
    status: "Shipped",
    statusClass: "shipped",
    date: "14/05/2025 10:50am",
    orderNo: "5123456789789456",
    title: "Home With Full Texture Isometric Room",
    price: "$299",
    qty: 1,
     img: texture,
  },
  {
    status: "Cancelled",
    statusClass: "cancelled",
    date: "14/05/2025 10:50am",
    orderNo: "5123456789789456",
    title: "Home With Full Texture Isometric Room",
    price: "$299",
    qty: 1,
     img: texture,
  },
];

export default function Order() {
  const navigate = useNavigate()
  const [selectedTab, setSelectedTab] = useState("All");

  const tabs = ["All", "Shipped", "Delivered", "Cancelled", "Returned"];

  const filteredOrders =
    selectedTab === "All"
      ? orders
      : orders.filter((order) => order.status === selectedTab);

  return (
    <div className="my-order-section container mt-4">
      <h4 className="mb-3 fw-bold">My Order</h4>

      <div className="order-tabs mb-3 d-flex gap-3">
        {tabs.map((tab) => (
          <span
            key={tab}
            className={`order-tab ${selectedTab === tab ? "active" : ""}`}
            onClick={() => setSelectedTab(tab)}
            style={{ cursor: "pointer" }}
          >
            {tab}
          </span>
        ))}
      </div>

      {filteredOrders.length === 0 ? (
        <p>No orders found for {selectedTab}.</p>
      ) : (
        filteredOrders.map((order, index) => (
          <div className="order-card mb-3 p-3" key={index}>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className={`order-status ${order.statusClass}`}>
                {order.status}
              </span>
              <span className="rate-review">⭐ Rate & Review Product</span>
            </div>

            <div className="order-meta mb-2">
              {order.date} &nbsp; | &nbsp; Order no. {order.orderNo}
            </div>

            <div className="row align-items-center">
              <div className="col-3 col-md-2">
                <img
                  src={order.img}
                  alt="product"
                  className="img-fluid rounded"
                />
              </div>
              <div className="col-9 col-md-7">
                <div className="order-title fw-semibold">{order.title}</div>
                <div className="order-price">
                  {order.price} x {order.qty}
                </div>
              </div>
              <div className="col-12 col-md-3 text-md-end mt-3 mt-md-0">
                <div className="order-total mb-2">
                  Total: <strong>{order.price}</strong>
                </div>
                <button onClick={() => navigate("/order-details")} className="btn btn-danger order-btn">
                  Order Details
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
