import React, { useState, useEffect } from 'react';
import "./WallInfoPanel.css";
// import { is } from '@react-three/fiber/dist/declarations/src/core/utils';

const WallInfoPanel = ({ selectedWall, is3D, onChange }) => {
  const [wall, setWall] = useState(selectedWall);

  useEffect(() => {
    setWall(selectedWall);
  }, [selectedWall]);

  if (!wall) {
    return null;
  }
console.log(wall);
  const lengthFeetFloat = Math.hypot(
    wall.end.x - wall.start.x,
    wall.end.y - wall.start.y
  ) / 50; // Using gridSize of 50
  const feet = Math.floor(lengthFeetFloat);
  const inches = Math.round((lengthFeetFloat - feet) * 11);
  const totalInches = (feet * 12) + inches;
  const height = wall.height;
  const meters = totalInches * 0.0254;
  // const text = `${feet}' ${inches}''`;
  const text = `${meters.toFixed(2)} m`;

  const handleInputChange = (key, value) => {
    const updatedWall = { ...wall, [key]: Number(value) };
    console.log(updatedWall);
    setWall(updatedWall);
    if (onChange) onChange(updatedWall);
  };

  return (
    <div className={`wall-info-panel`}>
      <div className="wall-info-content">
        <div className="wall-info-item">
          <label>wall name:</label>
          <span>{wall.name}</span>
        </div>
        <div className="wall-info-item">
          <label>wall type:</label>
          <span>{wall.type === 1 ? 'Interior' : 'Exterior'}</span>
        </div>
        <div className="wall-info-item">
          <label>length:</label>
          <span>{`${text}`}</span>
        </div>
        {is3D && (
          <div className="wall-info-item">
            <label>thickness:</label>
            <input
              type="number"
              value={wall.thichknes}
              onChange={e => handleInputChange('thichknes', e.target.value)}
              style={{ width: 60 }}
            />
          </div>
        )}
        {is3D && (
          <div className="wall-info-item">
            <label>height:</label>
            <input
              type="number"
              value={wall.height}
              onChange={e => handleInputChange('height', e.target.value)}
              style={{ width: 60 }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default WallInfoPanel; 