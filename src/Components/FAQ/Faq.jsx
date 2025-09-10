import { useEffect, useState } from "react";
import "./FAQ.css";
import { faqApi } from "../../apis/authApis/faqApi";

const Faq = ({ hideHeading = true }) => {
  const [openIndex, setOpenIndex] = useState(null);
  const [data, setData] = useState([]);
  const [heading, setHeading] = useState([]);
  const [loading, setLoading] = useState(true);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const fetchFaqData = async () => {
    try {
      const response = await faqApi();
      const faqData = response?.data?.faq?.faq;
      const heading = response?.data?.faq?.subHeading;
      setData(faqData);
      setHeading(heading);
    } catch (error) {
      console.error("Error fetching header data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <section className="faq-section">
      <div className="container faq-container  ">
        <div className="head-content">
          <h1>Frequently Asked Questions</h1>
         {
          hideHeading && (
             <p className="pt-3">{heading}</p>
          )
         }
        </div>
        <div className="accordion" id="faqAccordion">
          {data?.map((item, index) => (
            <div className="accordion-item mb-3" key={index}>
              <h2 className="accordion-header" id={`heading${index}`}>
                <button
                  className={`accordion-button faq-question ${
                    openIndex === index ? "" : "collapsed"
                  }`}
                  type="button"
                  onClick={() => toggleFAQ(index)}
                  aria-expanded={openIndex === index ? "true" : "false"}
                  aria-controls={`collapse${index}`}
                >
                  {item?.question}
                </button>
              </h2>
              <div
                id={`collapse${index}`}
                className={`accordion-collapse collapse ${
                  openIndex === index ? "show" : ""
                }`}
                aria-labelledby={`heading${index}`}
                data-bs-parent="#faqAccordion"
              >
                <div className="accordion-body">{item?.answer}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Faq;
