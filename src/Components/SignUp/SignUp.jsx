import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/Logo_blue.svg";
import signupIllustration from "../../assets/Signup.png";
import "./SignUp.css";
import { signUpApi } from "../../apis/authApis/authApis";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ErrorToaster } from "../../utils/toaster";

const SignUp = () => {
  // const [captcha, setCaptcha] = useState(generateCaptcha());
  // const [captchaInput, setCaptchaInput] = useState("");
  // const [isCaptchaValid, setIsCaptchaValid] = useState(null);
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("Afghanistan");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [accountName, setAccountName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState({});
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };



  const validatePassword = (password) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const validatePhone = (phone) => {
    const regex = /^[0-9]{7,15}$/;
    return regex.test(phone);
  };


  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      ErrorToaster("Password and confirm password do not match!");
      return;
    }
    const validationErrors = {};

    if (!accountName.trim()) {
      validationErrors.accountName = "Account Name is required.";
    }

    if (!validateEmail(email)) {
      validationErrors.email = "Invalid email format.";
    }

    if (!validatePassword(password)) {
      validationErrors.password =
        "Password must be at least 8 characters, include uppercase, lowercase, number, and special character.";
    }

    if (password !== confirmPassword) {
      validationErrors.confirmPassword = "Passwords do not match.";
    }

    if (!termsAccepted) {
      ErrorToaster("You must accept the terms and conditions.");
      return;
    }

    if (!validatePhone(phone)) {
      validationErrors.phone = "Enter a valid phone number.";
    }

    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);
      return;
    }

    const data = {
      email: email,
      account_name: accountName,
      company: company,
      password: password,
      phone: phone,
      country: selectedCountry,
    };

    try {
      setLoading(true);
      await signUpApi(data, navigate);
      setLoading(false);
    } catch (error) {
      alert(error.response?.data?.message || "Signup failed. Try again.");
    }
  };

  useEffect(() => {
    fetch("/countries.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => setCountries(data))
      .catch((error) => {
        console.error("There was an error fetching the countries:", error);
      });
  }, []);

  // function generateCaptcha() {
  //   const chars =
  //     "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  //   let result = "";
  //   for (let i = 0; i < 6; i++) {
  //     result += chars.charAt(Math.floor(Math.random() * chars.length));
  //   }
  //   return result;
  // }

  // const handleRefreshCaptcha = () => {
  //   setCaptcha(generateCaptcha());
  //   setCaptchaInput("");
  //   setIsCaptchaValid(null);
  // };

  // const checkCaptcha = () => {
  //   setIsCaptchaValid(captchaInput === captcha);
  // };

  const handleCountryChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedCountry(selectedValue);
  };

  return (
    <>
      <section className="signup-section">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-6 login-left-col">
              <div className="signup-left-main">
                <img
                  className="img-fluid "
                  src={signupIllustration}
                  alt="Signup Illustration"
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="register-container1">
                <div className="auth-logo1">
                  <img
                    onClick={() => navigate("/")}
                    className="img-fluid"
                    src={logo}
                    alt="Sova Logo"
                  />
                </div>
                <h2>Sign Up</h2>
                <p className="mb-4 mt-2">
                  {" "}
                  Welcome to Sova - Enter your details to Sign Up
                </p>
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <input
                      type="email"
                      id="email"
                      placeholder="Email*"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    {error.email && (
                      <small className="text-danger">{error.email}</small>
                    )}
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      id="account-name"
                      placeholder="Account name*"
                      value={accountName}
                      onChange={(e) => setAccountName(e.target.value)}
                      required
                    />
                    {error.accountName && (
                      <small className="text-danger">{error.accountName}</small>
                    )}
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      id="company"
                      placeholder="Company*"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="new-password"
                      placeholder="New password*"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <div
                      className="password-toggle dash-login"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEye /> : <FaEyeSlash />}
                    </div>
                    {error.password && (
                      <small className="text-danger">{error.password}</small>
                    )}
                  </div>
                  <div className="form-group">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirm-password"
                      placeholder="Confirm password*"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    <div
                      className="password-toggle dash-login"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                    </div>
                    {error.confirmPassword && (
                      <small className="text-danger">
                        {error.confirmPassword}
                      </small>
                    )}
                  </div>

                  <div className="form-group">
                    <input
                      type="tel"
                      id="phone"
                      placeholder="Phone number*"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <select
                      className="Select-country"
                      value={selectedCountry}
                      onChange={handleCountryChange}
                      required
                    >
                      <option value="" disabled>
                        Select Country
                      </option>
                      {countries.map((country, index) => (
                        <option key={index} value={country.name}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* <div className="Captcha-box1">
                    <div className="form-captcha1">
                      <label htmlFor="captcha">Type letters below</label>
                      <div className="captcha-container1">
                        <span className="captcha-code1">{captcha}</span>
                        <button
                          type="button"
                          className="refresh-captcha1"
                          onClick={handleRefreshCaptcha}
                        >
                          &#x21bb;
                        </button>
                      </div>
                      <div className="captcha-input-container1">
                        <div className="captcha-input-wrapper">
                          <input
                            type="text"
                            id="captcha"
                            placeholder="Enter captcha"
                            value={captchaInput}
                            onChange={(e) => setCaptchaInput(e.target.value)}
                          />
                          <button
                            type="button"
                            className="check-captcha-button1"
                            onClick={checkCaptcha}
                          >
                            Check
                          </button>
                        </div>
                        {isCaptchaValid === true && (
                          <p className="captcha-valid1">Captcha is correct!</p>
                        )}
                        {isCaptchaValid === false && (
                          <p className="captcha-invalid1">
                            Incorrect captcha. Try again.
                          </p>
                        )}
                      </div>
                    </div>
                  </div> */}
                  <div className="form-terms1">
                    <label>
                      <input
                        type="checkbox"
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                      />{" "}
                      I accept the terms of use
                    </label>
                  </div>

                  <div className="now-main">
                    <button
                      type="submit"
                      className="signup-button"
                      disabled={loading}
                    >
                      {loading ? "Signing Up..." : "Sign Up"}
                    </button>

                    <p className="account_login_signup_text">
                      Already Have an Account?{" "}
                      <button type="button" onClick={() => navigate("/signin")}>
                        Sign in now
                      </button>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default SignUp;
