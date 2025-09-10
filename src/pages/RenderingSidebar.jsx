import React, { useState } from "react";
import "./css/ModelSidebar.css";
import GridCanvas from "./GridCanvas";
import RenderScene from "./RenderScene";
import file from "../assets/Icons/file.png";

const RenderingSidebar = () => {
  const [renderingStarted, setRenderingStarted] = useState(false);
  

  

  return (
    <div className="drawing-app">
      <div className="sidebar">
       
        {!renderingStarted && (
          <button
            onClick={() => setRenderingStarted(true)}
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              marginTop: "20px",
            }}
          >
            Start Rendering
          </button>
        )}
      </div>
      <div className="Model-container">
        {!renderingStarted ? (
          <GridCanvas
            wallVertices={wallVertices}
            setWallVertices={setWallVertices}
            droppedModels={droppedModels}
            setDroppedModels={setDroppedModels}
          />
        ) : (
          <RenderScene
            wallVertices={wallVertices}
            droppedModels={droppedModels}
          />
        )}
      </div>
    </div>
  );
};

export default RenderingSidebar;
