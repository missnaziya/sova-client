import "./css/Shop.css";
import design from "../assets/admin/design.png";
import { useNavigate } from "react-router-dom";


const Shop = () => {
  const navigate = useNavigate();
  return (
    <section className='shop-section'>
    <div className=" container shop-container">
      <main className="content">
        <h2>My Shop Design</h2>
        <div className="design-container">
          <div className="design-preview">
            <img  className='img-fluid' src={design} alt="Design" />
          </div>
          <div className="design-buttons pt-3">
            <button className="btn-edit">Edit Design</button>
            <button onClick={() =>  navigate("/dashboard")} className="btn-create">Create a New Design</button>
          </div>
        </div>
      </main>
    </div>
    </section>
  );
}

export default Shop
