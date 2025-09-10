import React,{useState} from 'react'
import "./css/Payment.css";
import Google from "../assets/admin/payment/google.png";
import  paypal from "../assets/admin/payment/paypal.png";
import apple from "../assets/admin/payment/apple.png";
import discover from "../assets/admin/payment/discover.png";
import American from "../assets/admin/payment/American.png";
import Master from "../assets/admin/payment/Master.png";
import Visa from "../assets/admin/payment/visa.png";
const Payment = () => {
  const [cardDetails, setCardDetails] = useState({
    cardHolderName: "Amelia Olivia",
    cardNumber: "1345 5674 3686 3579",
    expiry: "10 / 25",
    ccv: "10 / 25",
  });

  return (
    <div className="payment-container">
      <h2>Payment Method</h2>
      <div className="payment-icons">
        <img src={Master} alt="MasterCard" className="selected" />
        <img src={Visa} alt="Visa" />
        <img src={American} alt="American Express" />
        <img src={apple} alt="Apple Pay" />
        <img src={discover} alt="Discover" />
        <img src={paypal} alt="PayPal" />
        <img src={Google} alt="Google Pay" />
      </div>
      <form className="payment-form">
        <div className="form-group">
          <label>Card Holder Name</label>
          <input
            type="text"
            value={cardDetails.cardHolderName}
            readOnly
            className="input-field"
          />
        </div>
        <div className="form-group">
          <label>Card Number</label>
          <input
            type="text"
            value={cardDetails.cardNumber}
            readOnly
            className="input-field"
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Expiry</label>
            <input
              type="text"
              value={cardDetails.expiry}
              readOnly
              className="input-field"
            />
          </div>
          <div className="form-group">
            <label>CCV</label>
            <input
              type="text"
              value={cardDetails.ccv}
              readOnly
              className="input-field"
            />
          </div>
        </div>
        <button type="button" className="payment-button">
          Payment
        </button>
      </form>
    </div>
  );
};

export default Payment;
