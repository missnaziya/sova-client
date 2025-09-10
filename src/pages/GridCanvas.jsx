import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import GridCanvas2D from "./GridCanvas2D";
import GridCanvas3D from "./GridCanvas3D";
import "./css/GridCanvas.css";
import { saveProject } from "../apis/authApis/projectApi";
import ExportPage from "./ExportPage";

const GridCanvas = React.forwardRef(
  (
    {
      drawingtab,
      setDrawingTab,
      selectedModel,
      loadedModels = [],
      setShowModels,
      setShowTextures,
      showModels,
      showTextures,
      modelCategories,
      textureCategories,
      isLoading,
    },
    ref
  ) => {
    const [lines, setLines] = useState([]);
    const [corners, setCorners] = useState([]);
    const [rooms, setRooms] = useState([]);
    const navigate = useNavigate();
    const gridCanvas3DRef = useRef(null);
    const grid2DRef = useRef();
    const grid3DRef = useRef();
    const [exportData, setExportData] = useState(null);
    const [showExportPage, setShowExportPage] = useState(false);

    // Forward the ref methods
    React.useImperativeHandle(ref, () => ({
      checkSelectedModel3D: () =>
        gridCanvas3DRef.current?.checkSelectedModel3D?.(),
      getSelectedModelMeshes: () =>
        gridCanvas3DRef.current?.getSelectedModelMeshes?.(),
      setLines: (lines) => grid2DRef.current?.setLines?.(lines),
    }));

    const handleSaveProject = async () => {
      // Gather lines, corners, and models used in 3D
      const projectData = {
        lines,
        corners,
        models: gridCanvas3DRef.current?.props?.loadedModels || [],
      };
      const json = JSON.stringify(projectData, null, 2);
      // Trigger download
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "sova_project.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Save to server using API
      try {
        const response = await saveProject({
          projectName: "My 3D Scene23",
          projectData: { Data: projectData },
        });
        // Optionally show a success message
        console.log("Project saved to server!", response);
      } catch (error) {
        // Optionally show an error message
        console.error("Failed to save project to server:", error);
      }
    };

    const handleExport = async () => {
      // Save the current tab
      const prevTab = drawingtab;
      let screenshot2D = "";
      let screenshot3D = "";
      setShowExportPage(true);
      if (drawingtab) {
        // 2D tab is open
        screenshot2D = grid2DRef.current?.get2DScreenshot?.() || "";
        setDrawingTab(false); // Switch to 3D
        await new Promise((resolve) => setTimeout(resolve, 100));
        screenshot3D = gridCanvas3DRef.current?.forceRenderAndScreenshot?.() || "";
      } else {
        // 3D tab is open
        screenshot3D = gridCanvas3DRef.current?.forceRenderAndScreenshot?.() || "";
        setDrawingTab(true); // Switch to 2D
        await new Promise((resolve) => setTimeout(resolve, 100));
        screenshot2D = grid2DRef.current?.get2DScreenshot?.() || "";
      }

      // Restore previous tab
      setDrawingTab(prevTab);

      // Show export modal
      setExportData({
        walls: lines,
        models: loadedModels.map((obj) => obj.info),
        screenshot2D,
        screenshot3D,
      });
      
    };

    return (
      <div className="maindivgridcanvas">
        {/* ExportPage overlay modal */}
        {showExportPage && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0,0,0,0.3)",
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                background: "#fff",
                borderRadius: 8,
                boxShadow: "0 4px 32px rgba(0,0,0,0.2)",
                maxWidth: 900,
                width: "100%",
                maxHeight: "100%",
                overflow: "auto",
                padding: 32,
              }}
            >
              <ExportPage
                {...exportData}
                onBack={() => setShowExportPage(false)}
              />
            </div>
          </div>
        )}
        {/* Main UI remains visible */}
        <div className="divupper2d_3d grid-toolbar">
          <div className="button_div_global">
            <button
              className="back-button target-button button-back"
              onClick={() => navigate("/")}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15 8H1M1 8L8 15M1 8L8 1"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              className="save-project-btn target-button"
              style={{ marginRight: 0 }}
              onClick={handleSaveProject}
            >
              Save Project
            </button>
            <button
              className="save-project-btn target-button"
              style={{ marginRight: 80 }}
              onClick={handleExport}
            >
              Export
            </button>
          </div>

          <div className="toggle-center">
            <button
              className={`target-button ${drawingtab ? "active-button" : ""}`}
              onClick={() => {
                setShowTextures(false);
                setShowModels(false);
                setDrawingTab(true);
              }}
            >
              2D
            </button>
            <button
              className={`target-button ${!drawingtab ? "active-button" : ""}`}
              onClick={() => setDrawingTab(false)}
            >
              3D
            </button>
          </div>
        </div>
        {drawingtab ? (
          <GridCanvas2D
            onLinesChange={setLines}
            liness={lines}
            onCornerChange={setCorners}
            cornerss={corners}
            room={rooms}
            onChangeRooms={setRooms}
            ref={grid2DRef}
          />
        ) : (
          <GridCanvas3D
            ref={gridCanvas3DRef}
            lines={lines}
            roomss={rooms}
            selectedModel={selectedModel}
            loadedModels={loadedModels}
            setShowModels={setShowModels}
            setShowTextures={setShowTextures}
            showModels={showModels}
            showTextures={showTextures}
            modelCategories={modelCategories}
            textureCategories={textureCategories}
            isLoading={isLoading}
          />
        )}
      </div>
    );
  }
);

export default GridCanvas;
