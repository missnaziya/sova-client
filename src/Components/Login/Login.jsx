import { useRef, useState } from "react";
import "./Login.css";
import { IoEyeSharp } from "react-icons/io5";
import { FaEyeSlash } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/Logo_blue.svg";
import login from "../../assets/login.png";
import {
  changePasswordApi,
  forgotPasswordReqApi,
  LoginApi,
  otpVerifyApi,
} from "../../apis/authApis/authApis";

const Login = () => {
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const inputRefs = useRef([]);
  const [isLogin, setIsLogin] = useState("login");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const finalOtp = otp.join("");

  const navigate = useNavigate();

  const toggleForm = (value) => {
    setIsLogin(value);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleChange = (index, e) => {
    const value = e.target.value;
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLogin === "login") {
      const data = {
        email: email,
        password: password,
      };
      const response = await LoginApi(data, navigate);

      const userToken = response?.data?.token;
      if (userToken) {
        localStorage.setItem("sovaToken", userToken);
        console.log("response from loginApi", response.data);

        navigate(from, { replace: true });
      }
    } else if (isLogin === "forgotpasswordrequest") {
      const data = {
        email: email,
      };
      const response = await forgotPasswordReqApi(data);
      if (response) {
        toggleForm("verifyOtp");
      }
    } else if (isLogin === "verifyOtp") {
      const data = {
        email: email,
        email_otp: finalOtp,
      };
      const response = await otpVerifyApi(data);
      if (response) {
        toggleForm("newPassword");
      }
    } else if (isLogin === "newPassword") {
      const data = {
        email: email,
        new_Password: password,
      };
      const response = await changePasswordApi(data);
      if (response) {
        toggleForm("login");
      }
    }
  };



  return (
    <>
      <section className="login-section">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-6 login-left-col">
              <div className="login-left-main">
                <img
                  className="img-fluid"
                  src={login}
                  alt="Login Illustration"
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="register-container">
                <div className="auth-logo">
                  <img
                    onClick={() => navigate("/")}
                    className="img-fluid"
                    src={logo}
                    alt="Sova Logo"
                  />
                </div>

                {isLogin === "login" && (
                  <>
                    <h2>Sign In</h2>
                    <p>Welcome to Sova - Enter your details to sign in</p>
                    <form onSubmit={handleSubmit}>
                      <div className="form-group1">
                        <input
                          type="email"
                          id="email"
                          placeholder="Email*"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      <div className="form-group1">
                        <div className="password-container">
                          <input
                            type={passwordVisible ? "text" : "password"}
                            id="password"
                            placeholder="Password*"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                          <span
                            className="toggle-icon"
                            onClick={togglePasswordVisibility}
                          >
                            {passwordVisible ? <IoEyeSharp /> : <FaEyeSlash />}
                          </span>
                        </div>
                      </div>

                      <div className="now-main login-link">
                        <label className="remember-me">
                          <input type="checkbox" /> Remember me
                        </label>

                        <button
                          type="button"
                          className="forgot-password"
                          onClick={() => toggleForm("forgotpasswordrequest")}
                        >
                          Forgot your password?
                        </button>
                      </div>
                      <div className="now-main">
                        <button type="submit" className="login-button">
                          Sign In
                        </button>
                        <div className="login-link">
                          <p>Don't have an account?</p>

                          <button
                            type="button"
                            onClick={() => navigate("/signup")}
                          >
                            Sign up now
                          </button>
                        </div>
                      </div>
                    </form>
                  </>
                )}

                {isLogin === "forgotpasswordrequest" && (
                  <>
                    <h2>Forgot Your Password</h2>
                    <p>
                      Welcome to Sova - Enter your mail id to forgot your
                      password
                    </p>
                    <form onSubmit={handleSubmit}>
                      <div className="form-group1">
                        <input
                          type="email"
                          id="email"
                          placeholder="Email*"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>

                      <div className="now-main">
                        <button type="submit" className="login-button">
                          Send Otp
                        </button>
                        <div className="login-link">
                          <p>Back to login?</p>

                          <button onClick={() => toggleForm("login")}>
                            Click here
                          </button>
                        </div>
                      </div>
                    </form>
                  </>
                )}

                {isLogin === "verifyOtp" && (
                  <>
                    <h2>Enter your Otp</h2>
                    <p>
                      Welcome to Sova - Enter your Otp to reset your password
                    </p>
                    <form onSubmit={handleSubmit}>
                      <div className="otp-container">
                        {otp.map((digit, index) => (
                          <input
                            key={index}
                            type="text"
                            maxLength="1"
                            className="otp-box"
                            value={digit}
                            onChange={(e) => handleChange(index, e)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            ref={(el) => (inputRefs.current[index] = el)}
                          />
                        ))}
                      </div>

                      <div className="now-main">
                        <button type="submit" className="login-button">
                          Submit Otp
                        </button>
                        <div className="login-link">
                          <p>Back to login?</p>

                          <button onClick={() => toggleForm("login")}>
                            Click here
                          </button>
                        </div>
                      </div>
                    </form>
                  </>
                )}

                {isLogin === "newPassword" && (
                  <>
                    <h2>Enter Your New Password</h2>
                    <p>
                      Welcome to Sova - Enter your new password to change your
                      password
                    </p>
                    <form onSubmit={handleSubmit}>
                      <div className="form-group1">
                        <div className="password-container">
                          <input
                            type={passwordVisible ? "text" : "password"}
                            id="password"
                            placeholder="Password*"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                          <span
                            className="toggle-icon"
                            onClick={togglePasswordVisibility}
                          >
                            {passwordVisible ? <IoEyeSharp /> : <FaEyeSlash />}
                          </span>
                        </div>
                      </div>
                      <div className="now-main">
                        <button type="submit" className="login-button">
                          Change Password
                        </button>
                        <div className="login-link">
                          <p>Back to login?</p>

                          <button onClick={() => toggleForm("login")}>
                            Click here
                          </button>
                        </div>
                      </div>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
