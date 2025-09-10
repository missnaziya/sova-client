import { useState } from "react";
import "./css/ModelSidebar.css";
import Model from "./Model";
import file from "../assets/Icons/file.png";
import Sidebar1 from "./Sidebar";



const ModelSidebar = () => {
  const [drawingMode, setDrawingMode] = useState(false);

  const handleClick = () => setDrawingMode(true);
  const handleDoubleClick = () => setDrawingMode(false);
  

  const toolList = [
    { name: "Doors", icon: file },
    { name: "Windows", icon: file },
    { name: "Shelving", icon: file },
    { name: "Plinth", icon: file },
    { name: "Frames", icon: file },
    { name: "Light Box / Canopies", icon: file },
    { name: "Seating", icon: file },
    { name: "Tables", icon: file },
    { name: "Counters", icon: file },
    { name: "Cash Register", icon: file },
    { name: "Side Panels", icon: file },
    { name: "Accessories", icon: file },
    { name: "Chairs", icon: file },
    { name: "Workbenches", icon: file },
    { name: "Tool Storage", icon: file },
  ];
  
  return (
<>

    <div className="drawing-app">
      <div className="col-2 sidebar">
        <ul>
          {toolList.map((tool, index) => (
            <li
              key={index}
              onClick={index === 0 ? handleClick : undefined}
              onDoubleClick={index === 0 ? handleDoubleClick : undefined}
            >
              <img src={tool.icon} alt={tool.name} className="img-fluid icon2" />
              {tool.name}
            </li>
          ))}
        </ul>
      </div>

      <div className="col-10 Model-container">
        <Model />
      </div>
    </div>
</>
  );
};

export default ModelSidebar;
