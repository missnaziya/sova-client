import React, { useState } from "react";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import './css/ExportSidebar.css'
import Export from './Export'

const ExportSidebar = () => {
  const [preferences, setPreferences] = useState({
    language: "English",
    system: "Metric",
    unitPrecision: "Centimeter",
    area: "Decimal",
    formatting: "Formula",
  });

  const handleExport = () => {
    alert("Exporting preferences...");
  };

  const handleToggle = (key) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <section className="ExportSidebar-section">
      <div className="container export-container">
        <div className="row">
          <div className="col-12 col-md-3 col-lg-3 col-xl-2 col-xxl-2  export-sidebar">
            <h4>PDF Export</h4>
            <ul className="list">
              <li>
                Filename
                <input type="text" />.pdf
              </li>
              <li>
                Filename
                <input type="text" />
              </li>
              <li>
                Filename
                <input type="text" />
              </li>
              <li>
                Filename
                <input type="text" />
              </li>
              <li>
                <FormControlLabel
                  labelPlacement="start"
                  control={
                    <Switch
                      checked={preferences.showRoofs}
                      onChange={() => handleToggle("showRoofs")}
                    />
                  }
                  label="Color"
                />
              </li>
            </ul>
            <button className="btn-export" onClick={handleExport}>
              Start Exporting
            </button>

            <h4>PDF Export</h4>
            <ul>
            <li>
                Filename
                <input type="text" />.dx
              </li>
            </ul>

            <h2>Layers</h2>
            <ul className="list">
              {[
                "Default",
                "Annotation Properties ",
                "Area",
                "Area Label",
                "Space",
                "Space Label",
                "False ceiling",
                "3D item",
                "Doors",
                "Windows",
                "Ceiling",
                "Safety Volume",
                "Walls"
              ].map((item, index) => (
                <li key={index}>
                  <label>
                    <input
                      type="checkbox"
                      onChange={() => handleToggle(item)}
                      checked={preferences[item] || false}
                    />
                    {item}
                  </label>
                </li>
                
                
              ))}
              <li>
                 <button className="btn-export" onClick={handleExport}>
                 Start Exporting
               </button>
               </li>
            </ul>

            <h4>Export GLTF</h4>
            <ul className="list">
            <li>
                Filename
                <input type="text" />.glb
              </li>   
            <li>
                <FormControlLabel
                  labelPlacement="start"
                  control={
                    <Switch
                      checked={preferences.showRoofs}
                      onChange={() => handleToggle("showRoofs")}
                    />
                  }
                  label="Color"
                />
              </li>
              <li>
                 <button className="btn-export" onClick={handleExport}>
                 Start Exporting
               </button>
               </li>

            </ul>
          </div>
          <div className="col-9">
            <Export/>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExportSidebar;

