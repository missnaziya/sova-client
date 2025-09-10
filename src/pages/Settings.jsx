import { useState } from "react";
import "./css/Settings.css";
import { ErrorToaster } from "../utils/toaster";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Settings = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = {};
    if (!password) {
      validationErrors.password = "Password is required.";
    }
    if (!confirmPassword) {
      validationErrors.confirmPassword = "Confirm password is required.";
    }
    if (password && confirmPassword && password !== confirmPassword) {
      validationErrors.confirmPassword = "Passwords do not match.";
      ErrorToaster("Password and confirm password do not match!");
    }

    setError(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      // Submit logic goes here
      console.log("Passwords updated:", password);
    }
  };

  return (
    <section className="settings-section">
      <div className="container">
        <h2 className="mb-5" >Settings</h2>
        <form className="settings-password-main" onSubmit={handleSubmit}>
          <div className="form-group mb-4">
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
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
            </div>
            {error.confirmPassword && (
              <small className="text-danger">{error.confirmPassword}</small>
            )}
          </div>

          <button type="submit">SUBMIT</button>
        </form>
      </div>
    </section>
  );
};

export default Settings;
