import React, { useState, useEffect, useRef } from "react";
import "./css/Shopdesign.css";
import GridCanvas from "./GridCanvas";
import exterior from "../assets/Icons/Exterior.png";
import partitionWall from "../assets/Icons/Interior.png";
import rectangularRoom from "../assets/Icons/rectangular room.png";
import outdoorSpace from "../assets/Icons/Outdoor.png";
import spaceDivider from "../assets/Icons/Divider.png";
import doors from "../assets/Icons/Doors.png";
import windows from "../assets/Icons/Windows.png";
import floorCut from "../assets/Icons/cut.png";
import roof from "../assets/Icons/roof.png";
import automaticRoof from "../assets/Icons/automatic roof.png";
import orthogonal from "../assets/Icons/orthogonal.png";
import angled from "../assets/Icons/angled.png";
import note from "../assets/Icons/notes.png";
import arrow from "../assets/Icons/arrow.png";
import rectangle from "../assets/Icons/rectangle.png";
import ruler from "../assets/Icons/ruler.png";
import section from "../assets/Icons/section.png";
import distancing from "../assets/Icons/distancing.png";
import { useDrawing } from "../context/DrawingContext";
import { drawmode } from "../Components/Utils/Generate";
import AssetSelector from "../Components/Utils/AssetSelector";
import { motion } from "framer-motion";
import { fetchAllModels} from '../apis/authApis/modelsApi';
import { fetchAllTextures } from '../apis/authApis/texturesApi';
import TextureSelector from "../Components/Utils/TextureSelector";
import Sidebar1 from "./Sidebar";
import { getShopCategories } from '../apis/shopApis';
import { loadProjects } from "../apis/authApis/projectApi";
// import BackArrow from "../Components/Utils/BackArrow";


const Shopdesign = () => {
  const { setDrawingMode, setCurrentDrawMode } = useDrawing();
  const [drawingtab, setDrawingTab] = useState(true);
  const [showTextures, setShowTextures] = useState(false);
  const [showModels, setShowModels] = useState(false);
  const [modelCategories, setModelCategories] = useState([]);
  const [textureCategories, setTextureCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [sidebarPinned, setSidebarPinned] = useState(true);
  const [sidebarHovered, setSidebarHovered] = useState(false);
  const [loadedModels, setLoadedModels] = useState([]);
  const gridCanvasRef = useRef();
  const [textureError, setTextureError] = useState(null);
  const [selectedModelInfo, setSelectedModelInfo] = useState(null);
  const [selectedMeshes, setSelectedMeshes] = useState([]);
  const [showCategoryModal, setShowCategoryModal] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [shopCategories, setShopCategories] = useState([
    { id: 'retail', name: 'Retail Store' },
    { id: 'restaurant', name: 'Restaurant' },
    { id: 'office', name: 'Office Space' },
    { id: 'warehouse', name: 'Warehouse' },
    { id: 'salon', name: 'Beauty Salon' },
    { id: 'gym', name: 'Gym/Fitness Center' },
    { id: 'clinic', name: 'Medical Clinic' },
    { id: 'custom', name: 'Custom/Other' },
  ]);
  const [categoryStep, setCategoryStep] = useState('choose'); // 'choose', 'shop', 'user'
  const [userCategories, setUserCategories] = useState([]);
  const [userSelectedCategory, setUserSelectedCategory] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);

  // Function to load projects and organize them into categories
  const loadUserProjects = async () => {
    const apiProjects = await loadProjects();
    console.log('API response (projects):', apiProjects);
    if (apiProjects && Array.isArray(apiProjects.projects) && apiProjects.projects.length > 0) {
      setUserCategories(apiProjects.projects);
    } else {
      setUserCategories([]);
    }
  };

  const handleCategorySelect = () => {
    if (selectedCategory) {
      setShowCategoryModal(false);
      localStorage.setItem('selectedShopCategory', selectedCategory);
    }
  };

  const handleUserCategorySelect = () => {
    if (userSelectedCategory) {
      setShowCategoryModal(false);
      localStorage.setItem('selectedShopCategory', userSelectedCategory);
      
      // Find the selected project
      const selectedProject = userCategories.find(project => project.projectId === userSelectedCategory);
      if (selectedProject) {
        handleProjectSelect(selectedProject);
      }
    }
  };

  const handleProjectSelect = (project) => {
    setSelectedProject(project);
    setShowCategoryModal(false);
    localStorage.setItem('selectedShopCategory', userSelectedCategory);
    localStorage.setItem('selectedProject', JSON.stringify(project));
    // Set lines in 2D canvas
    if (gridCanvasRef.current && gridCanvasRef.current.setLines) {
      gridCanvasRef.current.setLines(project.projectData?.Data?.lines || []);
    }
    // Switch to 2D tab
    setDrawingTab(true);
    console.log('Selected project:', project);
    console.log('Project data:', project.projectData);
    console.log('Objects in project:', project.projectData?.objects || []);
  };

  const getSelectedCategoryProjects = () => {
    const category = userCategories.find(cat => cat.id === userSelectedCategory);
    return category ? category.projects : [];
  };

  useEffect(() => {
    async function fetchCategories() {
      const apiCategories = await getShopCategories();
      console.log(apiCategories);
      if (apiCategories && Array.isArray(apiCategories) && apiCategories.length > 0) {
        setShopCategories(apiCategories.map(cat => ({
          id: cat._id || cat.id || cat.name,
          name: cat.name
        })));
      }
      
    }
    fetchCategories();
    loadUserProjects(); // Load user projects
    setShowCategoryModal(true);
  }, []);


  // Auto-close error UI after 3 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchAllModels();
        if (!data) {
          throw new Error('No data received from the server');
        }
        console.log(data);
        // setModelCategories(data.categories || data);
        setModelCategories(null);
      } catch (error) {
        let errorMessage = 'Failed to fetch models';
        if (error.code === 'ERR_NETWORK') {
          errorMessage = 'Network error - Unable to connect to the model server';
        } else if (error.response) {
          errorMessage = `Server error: ${error.response.status} - ${error.response.data?.message || error.message}`;
        } else if (error.request) {
          errorMessage = 'No response from server - Please check your connection';
        }
        setError(errorMessage);
        setModelCategories([]);
      } finally {
        setIsLoading(false);
      }
    };
    const fetchTextures = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchAllTextures();
        console.log(data);
        if (!data) {
          throw new Error('No data received from the server');
        }

        console.log(data);
        // If the API returns categories, set as is. Otherwise, adapt as needed.
        setTextureCategories(data.categories);
      } catch (error) {
        let errorMessage = 'Failed to fetch textures';
        if (error.code === 'ERR_NETWORK') {
          errorMessage = 'Network error - Unable to connect to the texture server';
        } else if (error.response) {
          errorMessage = `Server error: ${error.response.status} - ${error.response.data?.message || error.message}`;
        } else if (error.request) {
          errorMessage = 'No response from server - Please check your connection';
        }
        setError(errorMessage);
        setTextureCategories([]);
      } finally {
        setIsLoading(false);
      }
    };
    if (!drawingtab) {
      fetchModels();
      fetchTextures();
    }
  }, [drawingtab]);

  // Poll for selected model info when 3D tab is active
  useEffect(() => {
    if (!drawingtab && gridCanvasRef.current && gridCanvasRef.current.getSelectedModelInfo) {
      const interval = setInterval(() => {
        setSelectedModelInfo(gridCanvasRef.current.getSelectedModelInfo());
      }, 500);
      return () => clearInterval(interval);
    } else {
      setSelectedModelInfo(null);
    }
  }, [drawingtab]);

  const handleClick = (drawingmode=false, mode = 0, index = 0) => {
    if (!drawingtab && (index === 1 || index === 0)) {
      if (index === 1) {
        const hasSelectedModel = gridCanvasRef.current?.checkSelectedModel3D?.();
        console.log(hasSelectedModel);
        if (hasSelectedModel) {
          gridCanvasRef.current?.getSelectedModelMeshes?.() || [];
        }
        // Get all meshes from the selected model
      
       
     
        setShowTextures(true);
      } else {
        setShowModels(true);
      }
      return;
    }
   
    setDrawingMode(mode === 0 ? false : true);
    setCurrentDrawMode(mode);
  };

  const handleDoubleClick = () => {
    setDrawingMode(false);
    setDrawingTab(false);
  };

  const handleCanvasWheel = (event) => {
    // event.preventDefault();
  };


  const toolListfor2D = [
    { name: "Move", icon: exterior },
    { name: "InteriorWall", icon: partitionWall },
    { name: "ExteriorWall", icon: exterior },
    // { name: "Rectangular Room", icon: rectangularRoom },
    // { name: "Outdoor Space", icon: outdoorSpace },
    // { name: "Space Divider", icon: spaceDivider },
    // { name: "Cut in the floor", icon: floorCut },
  ];

  const toolListfor3D = [
    { name: "Add Objects", icon: orthogonal },
    { name: "Add Textures", icon: angled },
    // { name: "360 View", icon: note },
    // { name: "Walk In-Mode", icon: arrow },
    // { name: "Rectangle", icon: rectangle },
    // { name: "Ruler", icon: ruler },
    // { name: "Section / Elevation", icon: section },
    // { name: "Physical Distancing", icon: distancing },
  ];

  // Add error display to the UI
  const renderError = () => {
    if (!error) return null;
    return (
      <div className="error-message">
        {error}
      </div>
    );
  };

  // SVG for back arrow
  const BackArrow = ({ onClick }) => (
    <button className="modal-back-arrow" onClick={onClick} aria-label="Back">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#CE0809" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
    </button>
  );

  return (
    <div className="drawing-app">
      {/* Full Screen Category Selection Modal */}
      {showCategoryModal && categoryStep === 'choose' && (
        <div className="category-modal-overlay">
          <div className="category-modal-content">
            <h2>How do you want to start?</h2>
            <button onClick={() => setCategoryStep('shop')} className="start-designing-btn">Start from Scratch</button>
            <button onClick={() => setCategoryStep('user')} className="start-designing-btn">Edit Your Design</button>
          </div>
        </div>
      )}
      {showCategoryModal && categoryStep === 'shop' && (
        <div className="category-modal-overlay">
          <div className="category-modal-content">
            <BackArrow onClick={() => setCategoryStep('choose')} />
            <h2 className="category-modal-title">
              Select Shop Category
            </h2>
            <p className="category-modal-description">
              Choose the type of shop you want to design
            </p>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="category-dropdown"
            >
              <option value="">Select a category...</option>
              {shopCategories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <button
              onClick={handleCategorySelect}
              disabled={!selectedCategory}
              className="start-designing-btn"
            >
              Start Designing
            </button>
          </div>
        </div>
      )}
      {showCategoryModal && categoryStep === 'user' && (
        <div className="category-modal-overlay">
          <div className="category-modal-content">
            <BackArrow onClick={() => setCategoryStep('choose')} />
            <h2>Your Projects</h2>
            <p className="category-modal-description">
              Select a project to continue editing
            </p>
            <select
              value={userSelectedCategory}
              onChange={e => setUserSelectedCategory(e.target.value)}
              className="category-dropdown"
            >
              <option value="">Select a project...</option>
              {userCategories.map(project => (
                <option key={project.projectId} value={project.projectId}>
                  {project.projectName} ({(project.projectData?.objects?.length || 0)} objects)
                </option>
              ))}
            </select>
            <button
              onClick={handleUserCategorySelect}
              disabled={!userSelectedCategory}
              className="start-designing-btn"
            >
              Load Project
            </button>
          </div>
        </div>
      )}

      {renderError()}
      {textureError && (
        <div className="texture-error-message">{textureError}</div>
      )}
      {/* Show selected model info if available */}
      {!drawingtab && selectedModelInfo && (
        <div className="selected-model-info">
          <b>Selected Model Info:</b>
          <div>Name: {selectedModelInfo.name || '-'}</div>
          <div>ID: {selectedModelInfo.id || '-'}</div>
          {selectedMeshes.length > 0 && (
            <>
              <div style={{ marginTop: '10px' }}><b>Meshes:</b></div>
              {selectedMeshes.map((mesh, index) => (
                <div key={index} style={{ marginLeft: '10px' }}>
                  {mesh.name}
                </div>
              ))}
            </>
          )}
        </div>
      )}
      {((!showTextures && !showModels)) && (<motion.div
        className={`sidebar${sidebarPinned ? ' pinned' : ' unpinned'}${sidebarHovered ? ' hovered' : ''}`}
        onMouseEnter={() => setSidebarHovered(true)}
        onMouseLeave={() => setSidebarHovered(false)}
        animate={{
          width: sidebarPinned || sidebarHovered ? 250 : 40,
          paddingLeft: sidebarPinned || sidebarHovered ? 15 : 0,
          paddingRight: sidebarPinned || sidebarHovered ? 15 : 0,
        }}
        transition={{
          width: { duration: 0.7, ease: "easeInOut" },
          paddingLeft: { duration: 0.7, ease: "easeInOut" },
          paddingRight: { duration: 0.7, ease: "easeInOut" },
        }}
        style={{ position: 'absolute', top: 45, left: 60, height: '100%', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.2)', zIndex: 10, background: '#fff' }}
      >
        <div className="sidebar-pin-icon" onClick={() => setSidebarPinned(p => !p)} style={{ position: 'absolute', top: 8, right: 8, cursor: 'pointer', zIndex: 2 }}>
          {sidebarPinned ? (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 2L14 2M10 2V18M6 18L14 18" stroke="#333" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 2L14 2M10 2V18M6 18L14 18" stroke="#aaa" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="16" cy="4" r="2" fill="#aaa" />
            </svg>
          )}
        </div>
        <h3>DRAWING TOOLS</h3>
        <ul>
          {(drawingtab ? toolListfor2D : toolListfor3D).map((tool, index) => (
            <li
              key={index}
              onClick={() => handleClick(drawmode[tool.name] === 0 ? false : true, drawmode[tool.name], index)}
              onDoubleClick={index === 0 ? handleDoubleClick : undefined}
            >
              <img
                src={tool.icon}
                alt={tool.name}
                className="img-fluid icon1"
              />
              {tool.name}
            </li>
          ))}
        </ul>
      </motion.div>)}

      {/* {!drawingtab && showTextures && !isLoading && (
        <TextureSelector
          categories={textureCategories}
          onClose={() => setShowTextures(false)}
          onSelect={handleTextureSelect}
          title="Select Texture"
          type="texture"
        />
      )}

      {!drawingtab && showModels && !isLoading && (
        <AssetSelector
          categories={modelCategories}
          onClose={() => setShowModels(false)}
          onSelect={handleModelSelect}
          title="Select Model"
          type="model"
        />
      )} */}

      <div className="canvas" onWheel={handleCanvasWheel}>
        <GridCanvas drawingtab={drawingtab} setDrawingTab={setDrawingTab} selectedModel={selectedModel} loadedModels={loadedModels} ref={gridCanvasRef} setShowModels={setShowModels} setShowTextures={setShowTextures} showModels={showModels} showTextures={showTextures} modelCategories={modelCategories} textureCategories={textureCategories} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default Shopdesign;

