import "bootstrap/dist/css/bootstrap.min.css";
import "./Contact.css";
import { contactFormApi } from "../../apis/authApis/contactFormApi";
import { useState } from "react";

const Contact = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const fullName = `${firstName} ${lastName}`;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      name: fullName,
      email: email,
      message: message,
    };

    try {
      const token = localStorage.getItem("sovaToken");
      await contactFormApi(data, token);
      setFirstName("");
      setLastName("");
      setEmail("");
      setMessage("");
    } catch (error) {
      alert(error.response?.data?.message || "Form submission. Try again.");
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <section className="contact-section">
      <div className="container">
        <div className="row">
          <div className=" col-md-6  pr-5 contact-sec">
            <h1>Contact Us</h1>
            <p>
              Need to get in touch with us? Either fill out the form with your
              inquiry or find the department email you’d like to contact below.
            </p>
          </div>

          <div className="col-md-6 right-container">
            <form onSubmit={handleSubmit} className="contact-form ">
   
              <div className="row">
                <div className="form-group2 mb-3 col-6">
                  <label htmlFor="firstName" className="custom-label">
                    First Name
                  </label>
                  <input
                    type="text"
                    className="form-control "
                    id="firstName"
                    placeholder="Enter your first name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group2 mb-3 col-6">
                  <label htmlFor="lastName" className="custom-label">
                    Last Name
                  </label>
                  <input
                    type="text"
                    className="form-control "
                    id="lastName"
                    placeholder="Enter your last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="form-group2 mb-3">
                <label htmlFor="email" className="custom-label">
                  Email Address
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group2 mb-3">
                <label htmlFor="message" className="custom-label">
                  How Can We Help You?
                </label>
                <textarea
                  className="form-control"
                  id="message"
                  rows="4"
                  placeholder="Type your message here"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="btn btn-danger btn-block"
                disabled={isLoading}
              >
                {isLoading ? "Submitting..." : "SUBMIT"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
