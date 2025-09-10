import "./Footer.css";
import logo from "../../assets/footer logo.png";
import { useEffect, useState } from "react";
import { footerApi } from "../../apis/authApis/footerApi";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const [data, setData] = useState(null);
  console.log(data, "footeer data");

  const navigate = useNavigate();
  const fetchFooterData = async () => {
    const response = await footerApi();
    const item = response.data.footer;
    setData(item);
    console.log(item.lastSection.newsletter.title, "item");
  };

  useEffect(() => {
    fetchFooterData();
  }, []);

  return (
    <section className="footer-section bg-dark">
      <footer className=" text-white pt-5">
        <div className="container bg-dark text-white footer-contain ">
          <div className="row mb-3 f-sec1">
            <div className="col-md-6 col-sm-12 footer-logo-img">
              <img
                src={data?.logoUrl || logo}
                alt="Sova Logo"
                className="footer-logo mb-3"
              />
            </div>
            <div className="col-md-6 col-sm-12 footer-social-icons ">
              <ul className="list-unstyled social-main">
                {data?.socialLinks?.map((social, i) => (
                  <li
                    key={i}
           
                  >
                    <a
                      href={social?.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img src={social?.icon} alt="social-icon" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="row  f-sec">
              {data?.sections?.map((section, i) => (
                <div key={i} className="col-12 col-lg-3 col-xl-3 col-xxl-3 col-md-4 mt-3 footer-head">
                  <h4>{section.name}</h4>
                  <ul className="list-unstyled footer-li">
                    {section?.link?.map((item, i) => (
                      <li key={i}>
                        <a href={item.url}>{item.name}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <div className="col-12 col-lg-3 col-xl-3 col-xxl-3 col-md-6  mt-3 text-white  footer-head1">
                <h4>{data?.lastSection?.newsletter?.title}</h4>
                <p className="text-white">
                  {data?.lastSection?.newsletter?.description}
                </p>

                <div className="newsletter-form">
                  <div className="input-group">
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Enter your email"
                      aria-label="Email"
                      aria-describedby="basic-addon1"
                    />
                    <button className="btn btn-primary" type="submit">
                      SUBMIT
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row ">
            <div className="col-md-12 mb-3  footer-bottom">
              <div className="d-flex justify-content-between text-white">
                <p className="mb-6 text-white m-0">{data?.copyright}</p>
                <p
                  onClick={() => navigate("/privacy-policy")}
                  className="mb-6 text-white m-0 privacy-para"
                >
                  Privacy Policy
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </section>
  );
};

export default Footer;
