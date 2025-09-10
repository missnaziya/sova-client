import React, { createContext, useContext, useState } from 'react';
import { drawmode } from '../Components/Utils/Generate';

const DrawingContext = createContext();

export const DrawingProvider = ({ children }) => {
  const [drawingMode, setDrawingMode] = useState(true);
  const [currentDrawMode, setCurrentDrawMode] = useState(drawmode.move);

  const value = {
    drawingMode,
    setDrawingMode,
    currentDrawMode,
    setCurrentDrawMode
  };

  return (
    <DrawingContext.Provider value={value}>
      {children}
    </DrawingContext.Provider>
  );
};

export const useDrawing = () => {
  const context = useContext(DrawingContext);
  if (!context) {
    throw new Error('useDrawing must be used within a DrawingProvider');
  }
  return context;
}; 