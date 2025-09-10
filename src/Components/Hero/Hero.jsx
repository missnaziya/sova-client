import { useNavigate } from "react-router-dom";
import "./Hero.css";
import arrow from "../../assets/arrow_outward.png";
import PropTypes from "prop-types";

const Hero = ({heroData}) => {
  const navigate = useNavigate();
console.log(heroData ,"heroData")
  const handleButtonClick = () => {
    navigate("/dashboard");
  };

  const backgroundStyle = {
    
    backgroundImage: `linear-gradient(91.09deg, #000000 -13.82%, rgba(0, 0, 0, 40%) 60.46%), url(${heroData?.backgroundImage})`,
  }; 

  return (
    <section className="hero-section" style={backgroundStyle}>
          <div className="container">
            <div className="row  text-overlay hero-box ">
        <div className="col-lg-6 col-md-8 col-sm-12">
        <h1>{heroData?.heading || "Create Your Stunning Online Shop"}</h1>

             <p>{heroData?.subHeading}</p>
             <div className="button-container">
              <button onClick={handleButtonClick} >Design Your Shop</button>
             <img
                src={arrow}
                alt="arrow"
                className="img-arrow"
                onClick={handleButtonClick}
              />
            </div>
    
        </div>
              
            </div>
          </div>
        </section>
  );
};

Hero.propTypes = {
  heroData: PropTypes.shape({
    heading: PropTypes.string,
    backgroundImage: PropTypes.string,
    subHeading: PropTypes.string,
  }),
};



export default Hero;
