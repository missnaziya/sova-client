// import React from 'react'
// import Autosave from './Autosave'

// const AutosaveSidebar = () => {
//   return (
//     <section className="AutosaveSidebar-section">
//     <div className='container Autoside-container'>
//         <div className='row'>
//             <div className='col-3'>
//                 <h1>Autosave</h1>
//                 <h4>General Preferences</h4>
//                 <ul className='l1' control={<Switch defaultChecked />}>
//                     <li >Language</li>
//                     <li>System</li>
//                     <li>Unit Precision</li>
//                     <li>Area</li>
//                     <li>Formatting</li>
//                     <button>Start Exporting </button>
//                 </ul>
//                 <h4>Architectural Elements</h4>
//                 <ul>
//                     <li>Show Roofs</li>
//                     <li>Automatic Dimensions</li>
//                     <li>2D Floor Opacity</li>
//                     <li>2D Wall Axes</li>
//                     <li>3D Wall Outlines</li>
//                     <li>Lock Walls</li>
//                 </ul>
//                 <h4>Furnishing & Decor</h4>
//                 <ul>
//                     <li>Show Furniture</li>
//                     <li>Show Ceiling Objects </li>
//                     <li>Enable Gryscale </li>
//                     <li>Opacity</li>
//                 </ul>
//                 <h4>Texts & Grid </h4>
//                 <ul>
//                     <li>Show Annotations</li>
//                     <li>Show Dimensions</li>
//                     <li>Text in 2D plan</li>
//                     <li>Text in 3D overview </li>
//                     <li>Texts in 3D Immersive</li>
//                     <li>Distance </li>
//                     <li>Show Background Grid</li>

//                 </ul>
//                 <h4>Line Settings </h4>
//                 <ul>
//                     <li>Show line in 2D plane</li>
//                     <li>Line Thickness</li>
//                     <li>Texts in 2D plan</li>
//                 </ul>

//             </div>
//             <div className='col-9'></div>
//             <Autosave/>
//         </div>
      
//     </div>
//     </section>
//   )
// }

// export default AutosaveSidebar


import React, { useState } from "react";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import './css/AutosaveSidebar.css'

const AutosaveSidebar = () => {
  const [preferences, setPreferences] = useState({
    showRoofs: true,
    automaticDimensions: false,
    floorOpacity: false,
    wallAxes: false,
    wallOutlines: false,
    lockWalls: false,
    showFurniture: true,
    ceilingObjects: false,
    enableGrayscale: false,
    annotations: true,
    showDimensions: true,
    backgroundGrid: true,
    lineIn2D: false,
  });

  const handleToggle = (key) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <section className="AutosaveSidebar-section">
      <div className="container autosave-container">
        <div className="row">
          <div className="col-12 col-md-3 col-lg-3 col-xl-2 col-xxl-2 autosave-sidebar">
            <h1>Autosave</h1>

            <h4>Architectural Elements</h4>
            <FormGroup>
              <FormControlLabel 
              labelPlacement="start"
              
                control={
                  <Switch
                    checked={preferences.showRoofs}
                    onChange={() => handleToggle("showRoofs")}
                  />
                }
                label="Show Roofs"
              />
              <FormControlLabel 
              labelPlacement="start"
                control={
                  <Switch
                    checked={preferences.automaticDimensions}
                    onChange={() => handleToggle("automaticDimensions")}
                  />
                }
                label="Automatic Dimensions"
              />
              <FormControlLabel 
              labelPlacement="start"
                control={
                  <Switch
                    checked={preferences.floorOpacity}
                    onChange={() => handleToggle("floorOpacity")}
                  />
                }
                label="2D Floor Opacity"
              />
              <FormControlLabel 
              labelPlacement="start"
                control={
                  <Switch
                    checked={preferences.wallAxes}
                    onChange={() => handleToggle("wallAxes")}
                  />
                }
                label="2D Wall Axes"
              />
              <FormControlLabel 
              labelPlacement="start"
                control={
                  <Switch
                    checked={preferences.wallOutlines}
                    onChange={() => handleToggle("wallOutlines")}
                  />
                }
                label="3D Wall Outlines"
              />
              <FormControlLabel 
              labelPlacement="start"
                control={
                  <Switch
                    checked={preferences.lockWalls}
                    onChange={() => handleToggle("lockWalls")}
                  />
                }
                label="Lock Walls"
              />
            </FormGroup>

            <h4>Furnishing & Decor</h4>
            <FormGroup>
              <FormControlLabel 
              labelPlacement="start"
                control={
                  <Switch
                    checked={preferences.showFurniture}
                    onChange={() => handleToggle("showFurniture")}
                  />
                }
                label="Show Furniture"
              />
              <FormControlLabel 
              labelPlacement="start"
                control={
                  <Switch
                    checked={preferences.ceilingObjects}
                    onChange={() => handleToggle("ceilingObjects")}
                  />
                }
                label="Show Ceiling Objects"
              />
              <FormControlLabel 
              labelPlacement="start"
                control={
                  <Switch
                    checked={preferences.enableGrayscale}
                    onChange={() => handleToggle("enableGrayscale")}
                  />
                }
                label="Enable Grayscale"
              />
            </FormGroup>

            <h4>Texts & Grid</h4>
            <FormGroup>
              <FormControlLabel 
              labelPlacement="start"
                control={
                  <Switch
                    checked={preferences.annotations}
                    onChange={() => handleToggle("annotations")}
                  />
                }
                label="Show Annotations"
              />
              <FormControlLabel 
              labelPlacement="start"
                control={
                  <Switch
                    checked={preferences.showDimensions}
                    onChange={() => handleToggle("showDimensions")}
                  />
                }
                label="Show Dimensions"
              />
              <FormControlLabel 
              labelPlacement="start"
                control={
                  <Switch
                    checked={preferences.backgroundGrid}
                    onChange={() => handleToggle("backgroundGrid")}
                  />
                }
                label="Show Background Grid"
              />
            </FormGroup>

            <h4>Line Settings</h4>
            <FormGroup>
              <FormControlLabel 
              labelPlacement="start"
              
                control={
                  <Switch
                    checked={preferences.lineIn2D}
                    onChange={() => handleToggle("lineIn2D")}
                  />
                }
                label="Show Line in 2D"
              />
            </FormGroup>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AutosaveSidebar;



