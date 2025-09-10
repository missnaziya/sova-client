import React, { useState } from "react";
import logo from "../assets/Logo_blue.svg";
import loginImage from "../assets/login.png";
import signupImage from "../assets/Signup.png"; 
import "./LoginSignUp.css";
 
const LoginSignUp = () => {
  const [state, setState] = useState("Login");
  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [captchaInput, setCaptchaInput] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    company: "",
    phone: "",
    country: "",
  });
 
  function generateCaptcha() {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
 
 
  const changeHandler = (e) => {
setFormData({ ...formData, [e.target.name]: e.target.value });
  };
 
  
  const handleRefreshCaptcha = () => {
    setCaptcha(generateCaptcha());
    setCaptchaInput("");
  };
 
 
  const handleSubmit = (e) => {
    e.preventDefault();
    if (captchaInput !== captcha) {
      alert("Captcha is incorrect!");
      return;
    }
    if (state === "Login") {
      console.log("Logging in with: ", formData);
    } else {
      console.log("Signing up with: ", formData);
    }
  };
 
  return (
    <div className="login-container">
   
      <div className="login-left">
        <img
          src={state === "Login" ? loginImage : signupImage}
          alt={
            state === "Login" ? "Login Illustration" : "Sign Up Illustration"
          }
          className="login-illustration"
        />
      </div>
 
   
      <div className="login-right">
        <img src={logo} alt="Logo" className="login-logo" />
        <h2 className="login-title">
          {state === "Login" ? "Sign In" : "Sign Up"}
        </h2>
        <p className="login-subtitle">
          Welcome to Sova - Enter your details to{" "}
          {state === "Login" ? "sign in" : "sign up"}
        </p>
 
        <form className="login-form" onSubmit={handleSubmit}>
   
          {state === "Sign Up" && (
            <>
              <div className="form-group">
                <label>Account Name*</label>
                <input
                  type="text"
                  name="username"
                  placeholder="Account Name"
                  onChange={changeHandler}
                  value={formData.username}
                  required
                />
              </div>
              <div className="form-group">
                <label>Company*</label>
                <input
                  type="text"
                  name="company"
                  placeholder="Company"
                  onChange={changeHandler}
value={formData.company}
                />
              </div>
              <div className="form-group">
                <label>Phone No*</label>
                <input
                  type="text"
                  name="phone"
                  placeholder="Phone Number"
                  onChange={changeHandler}
                  value={formData.phone}
                />
              </div>
              <div className="form-group">
                <label>Country*</label>
                <input
                  type="text"
                  name="country"
                  placeholder="Country"
                  onChange={changeHandler}
value={formData.country}
                />
              </div>
            </>
          )}
 
  
          <div className="form-group">
            <label>Email*</label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={changeHandler}
value={formData.email}
              required
            />
          </div>
          <div className="form-group">
            <label>Password*</label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={changeHandler}
              value={formData.password}
              required
            />
          </div>
 
        
          <div className="form-captcha">
            <label>Type letters below*</label>
            <div className="captcha-container">
              <span className="captcha-code">{captcha}</span>
              <button
                type="button"
                className="refresh-captcha"
                onClick={handleRefreshCaptcha}
              >
                &#x21bb;
              </button>
            </div>
            <input
              type="text"
              placeholder="Enter Captcha"
              value={captchaInput}
              onChange={(e) => setCaptchaInput(e.target.value)}
              required
            />
          </div>
 
        
          <div className="form-terms">
            <label>
              <input type="checkbox" required /> I accept the terms of use
            </label>
          </div>
 
         
          <button type="submit" className="login-button">
            {state === "Login" ? "Sign In" : "Sign Up"}
          </button>
        </form>
 
       
        <p className="signup-link">
          {state === "Login" ? (
            <>
              Don’t have an account?{" "}
              <span onClick={() => setState("Sign Up")}>Create here</span>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <span onClick={() => setState("Login")}>Login here</span>
            </>
          )}
        </p>
      </div>
    </div>
  );
};
 
export default LoginSignUp;