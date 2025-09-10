import { useEffect, useState } from "react";
import "./css/PersonalDetails.css";
import {
  fetchProfile,
  updateProfile,
} from "../apis/authApis/personaDetailsApi";

const PersonalDetails = ({ setProfile }) => {
  const [f_name, setFirstName] = useState("");
  const [l_name, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [countries, setCountries] = useState([]);
  const [selectedCountryCode, setSelectedCountryCode] = useState("+91");
  const [selectedCountry, setSelectedCountry] = useState("India");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [account, setAccount] = useState("");
  const [company, setCompany] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [gender, setGender] = useState("Male");
  const [call, setCall] = useState(false);

  const handeleUpdate = async (e) => {
    e.preventDefault();
    setCall(true);
    const payload = {
      f_name,
      l_name,
      address,
      email,
      phone,
      country: selectedCountry,
      countryCode: selectedCountryCode,
      device_token: "dummy Token",
      account_name: account,
      company,
      language: selectedLanguage,
      gender,
    };

    try {
      const updateResponse = await updateProfile(payload);
      console.log(updateResponse, "updateResponse");
      const response = await fetchProfile();
      setProfile(response?.data?.profile);
    } catch (error) {
      console.error("Update Error:", error);
    } finally {
      setCall(false);
    }
  };

  const fetchProfileData = async () => {
    try {
      const response = await fetchProfile();
      const items = response?.data?.profile;
      console.log(items, "final items");
      setData(items);
      setAddress(items?.address || "");
      setAccount(items?.account_name || "");
      setCompany(items?.company || "");
      setFirstName(items?.f_name || "");
      setLastName(items?.l_name || "");
      setSelectedCountry(items?.country || "India");
      setSelectedLanguage(items?.language || "English");
      setSelectedCountryCode(items?.countryCode || "+91");
      setGender(items?.gender || "Male");
      setEmail(items?.email || "");
      setPhone(items?.phone || "");
    } catch (error) {
      console.error("Error fetching header data:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetch("/countries.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch countries: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setCountries(data);
      })
      .catch((error) => {
        console.error("Error fetching countries:", error);
        setError("Failed to load countries. Please try again later.");
      });
  }, []);

  useEffect(() => {
    fetchProfileData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  // const handleCountryCodeChange = (e) => {
  //   setSelectedCountryCode(e.target.value);
  // };

  const handleCountryCodeChange = (e) => {
    const dialCode = e.target.value;
    const country = countries.find((c) => c.dial_code === dialCode);
    setSelectedCountryCode(country?.dial_code);
  };

  const handleCountryChange = (e) => {
    setSelectedCountry(e.target.value);
  };

  const handleLanguageChange = (e) => {
    setSelectedLanguage(e.target.value);
  };

  const handeleGenderChange = (e) => {
    setGender(e.target.value);
  };

  return (
    <section className="personal-section">
      <div className="container details-container">
        <main className="details-content">
          <h2 className="py-3">My Personal Details</h2>
          <form onSubmit={handeleUpdate} className="details-form">
            <div className="details-form-group">
              <label>First Name</label>
              <input
                onChange={(e) => setFirstName(e.target.value)}
                type="text"
                placeholder="First Name"
                className="inputText"
                value={f_name}
              />
            </div>
            <div className="details-form-group">
              <label>Last Name</label>
              <input
                onChange={(e) => setLastName(e.target.value)}
                type="text"
                placeholder="Last Name"
                className="inputText"
                value={l_name}
              />
            </div>
            <div className="details-form-group">
              <label>Mobile No</label>
              <div className="details-mobile-input">
                <select
                  className="mobile-select"
                  value={selectedCountryCode}
                  onChange={handleCountryCodeChange}
                >
                  {countries.map((country, index) => (
                    <option key={index} value={country.dial_code}>
                      {`${country.dial_code}`} ({country.name})
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Enter phone"
                  className="inputText"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>
            <div className="details-form-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="Ameliaolivia@gmail.com"
                className="inputEmail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="details-form-group">
              <label>Account Name</label>
              <input
                type="text"
                placeholder="account name"
                className="inputEmail"
                value={account}
                onChange={(e) => setAccount(e.target.value)}
              />
            </div>

            <div className="details-form-group">
              <label>Company</label>
              <input
                type="text"
                placeholder="company"
                className="inputEmail"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>

            <div className="details-form-group">
              <label>Address</label>
              <input
                type="text"
                value={address}
                className="inputText"
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div className="details-form-group">
              <label>Gender</label>
              <select value={gender} onChange={handeleGenderChange}>
                <option>Male</option>
                <option>Female</option>
              </select>
            </div>
            <div className="details-form-group">
              <label>Language</label>
              <select value={selectedLanguage} onChange={handleLanguageChange}>
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
              </select>
            </div>
            <div className="details-form-group">
              <label>Country</label>
              <select value={selectedCountry} onChange={handleCountryChange}>
                {countries.map((country, index) => (
                  <option key={index} value={country.name}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="details-submit-button"
              disabled={call}
            >
              {call ? "Updating..." : "Update"}
            </button>
          </form>
          {error && <p className="error-message">{error}</p>}
        </main>
      </div>
    </section>
  );
};

export default PersonalDetails;
