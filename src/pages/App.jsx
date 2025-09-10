import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import ExportPage from './ExportPage';
import GridCanvas2D from './GridCanvas2D';
import GridCanvas3D from './GridCanvas3D';

function App() {
  const grid2DRef = React.useRef();
  const grid3DRef = React.useRef();
  const navigate = useNavigate();
  // Assume you have lines, loadedModelObjects, etc. in App state or props
  // Replace with your actual state management as needed
  const [lines, setLines] = React.useState([]);
  const [loadedModelObjects, setLoadedModelObjects] = React.useState([]);

  const handleExport = () => {
    const screenshot2D = grid2DRef.current?.get2DScreenshot?.() || '';
    const screenshot3D = grid3DRef.current?.get3DScreenshot?.() || '';
    navigate('/export', {
      state: {
        walls: lines,
        models: loadedModelObjects.map(obj => obj.info),
        screenshot2D,
        screenshot3D
      }
    });
  };

  return (
    <Routes>
      <Route path="/" element={
        <div>
          {/* ...other UI... */}
          <button
            className="save-project-btn target-button"
            style={{ marginRight: 80 }}
            onClick={handleExport}
          >
            Export
          </button>
          <GridCanvas2D ref={grid2DRef} /* ...other props... */ />
          <GridCanvas3D ref={grid3DRef} /* ...other props... */ />
        </div>
      } />
      <Route path="/export" element={<ExportPage />} />
    </Routes>
  );
}

export default function AppWithRouter() {
  return (
    <Router>
      <App />
    </Router>
  );
} 