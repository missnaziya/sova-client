import Slider from "react-slick";
import "./Shelving.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import PropTypes from "prop-types";


function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "block",
        border: "none",
        width: "40px",
        height: "40px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      onClick={onClick}
    />
  );
}

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "block",
        border: "none",
        width: "40px",
        height: "40px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      onClick={onClick}
    />
  );
}

const Shelving = ({ serviceData }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 425,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <section className="shelving-section">
      <div className="container shelving-container">
        <div className="head-content text-center">
          <h1>{serviceData?.heading}</h1>
          <p>{serviceData?.subHeading}</p>
        </div>
        <div className="row slider-row">
          <Slider {...settings} className="col">
            {serviceData?.service.map((items) => (
              <div key={items._id} className="p-3">
                <div className="info-card-shelving text-center">
                  <h3>{items?.serviceName}</h3>
                  <p>{items?.serviceDescription}</p>
                  <div className="image-card-shelving">
                    <img
                      className="img-fluid"
                      src={items?.serviceImage}
                      alt={items?.title}
                    />
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
};

Shelving.propTypes = {
  serviceData: PropTypes.shape({
    heading: PropTypes.string,
    subHeading: PropTypes.string,
    service: PropTypes.arrayOf(
      PropTypes.shape({
        serviceName: PropTypes.string,
        serviceDescription: PropTypes.string,
        serviceImage: PropTypes.string,
      })
    ),
  }),
};


export default Shelving;
