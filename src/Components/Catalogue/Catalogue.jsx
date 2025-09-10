import "./Catalogue.css";
import logo from "../../assets/Logo_blue.svg";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";




const Catalogue = ({ CatalogueData }) => {
  const cards = CatalogueData?.catalogue || [];

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    responsive: [
      {
        breakpoint: 1200,
        settings: { slidesToShow: 3 },
      },
      {
        breakpoint: 992,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 576,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  const renderCard = (item, index) => (
    <div key={index} >
      <div className="info-card">
        <img src={logo} alt="Logo" className="logo-img" />
        <div className="image-card">
          <img className="img-fluid" src={item?.catalogueImage} alt="img" />
        </div>
        <button className="Btn-2024">2024</button>
        <h3>{item?.catalogueName}</h3>
        <p>{item?.catalogueDescription}</p>
      </div>
    </div>
  );

  return (
    <section className="catalogue-section">
      <div className="container catalogue-container">
        <div className="head-content">
          <h1>{CatalogueData?.heading}</h1>
          <p>{CatalogueData?.subHeading}</p>
        </div>

        <div className="mt-4">
          {cards.length > 4 ? (
            <Slider {...sliderSettings}>
              {cards.map((item, index) => renderCard(item, index))}
            </Slider>
          ) : (
            <div className="row">
              {cards.map((item, index) => (
                <div key={index} className="col-12 col-md-6 col-lg-4 col-xl-3">
                  {renderCard(item, index)}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Catalogue;
