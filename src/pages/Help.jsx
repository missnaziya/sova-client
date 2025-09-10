import "./css/Help.css";
import Faq from "../Components/FAQ/Faq";

const Help = () => {
  return (
    <>
     

      <section className="help-faq">
       <div className="container helpbox-wrapper">
        <div className="helpbox-container">
          <p className="helpbox-title">Need Some Help?</p>
          <div className="helpbox-inputContainer">
            <input
              type="text"
              placeholder="What are you having trouble with?"
              className="helpbox-input"
            />
            <button className="helpbox-button">GET HELP</button>
          </div>
        </div>
      </div>
      
        <Faq hideHeading={false} />
      </section>
    </>
  );
};

export default Help;
