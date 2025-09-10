import Hero from "../Components/Hero/Hero";
import Shelving from "../Components/Shelving/Shelving";
import Catalogue from "../Components/Catalogue/Catalogue";
import Mobile from "../Components/Mobile/Mobile";
import Contact from "../Components/Contact/Contact";
import Faq from "../Components/FAQ/Faq";
import { homeApi } from "../apis/authApis/homeApi";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [data, setData] = useState();
const navigate = useNavigate()

  const [loading, setLoading] = useState(true);
  const fetchHomeData = async () => {
    try {
      const response = await homeApi(navigate);
      const homeData = response?.data?.home;
      setData(homeData);
    } catch (error) {
      console.error("Error fetching home data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomeData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Hero heroData={data && data?.heroSection} />
      <Shelving serviceData={data && data?.ServiceSection} />
      <Catalogue CatalogueData={data && data?.CatalogueSection} />
      <Mobile />
      <Faq />
      <Contact />
    </>
  );
};

export default Home;
