import React, { useState, useRef, useEffect } from "react";
import "./AssetSelector.css";

const TextureSelector = ({
  onClose,
  onSelect,
  title = "Select Texture",
  categories, // array of {category, items} or {category, subcategories}
  selectedMeshes = [], // Array of selected mesh names
  onMeshSelect, // Callback for mesh selection
}) => {
  // Flatten all textures for each category
  const getAllTextures = (cat) => {
    if (cat.items) return cat.items;
    if (cat.textures) return cat.textures;
    return [];
  };

  // State for open/close of categories
  const [openCategory, setOpenCategory] = useState(null);

  const toggleCategory = (catName) => {
    setOpenCategory((prev) => (prev === catName ? null : catName));
  };

  const handleMeshCheckboxChange = (meshName) => {
    if (onMeshSelect) {
      onMeshSelect(meshName);
    }
  };

  const selectAllRef = useRef(null);

  useEffect(() => {
    if (selectAllRef.current) {
      const allSelected = selectedMeshes.every(mesh => mesh.selected);
      const noneSelected = selectedMeshes.every(mesh => !mesh.selected);
      selectAllRef.current.indeterminate = !allSelected && !noneSelected;
    }
  }, [selectedMeshes]);

  return (
    <div className="asset-selector">
      <div className="asset-header">
        <h5>{title}</h5>
        <button onClick={onClose}>×</button>
      </div>
      
      {/* Mesh Selection Section */}
      {selectedMeshes.length > 0 && (
        <div className="mesh-selection-section">
          <h6>Select Meshes to Texture:</h6>
          <div style={{ marginBottom: '8px' }}>
            {/* Select All Checkbox */}
            <label style={{ marginRight: '16px', userSelect: 'none' }}>
              <input
                type="checkbox"
                ref={selectAllRef}
                checked={selectedMeshes.every(mesh => mesh.selected)}
                onChange={() => {
                  const allSelected = selectedMeshes.every(mesh => mesh.selected);
                  selectedMeshes.forEach(mesh => {
                    if (allSelected) {
                      // Deselect all
                      if (mesh.selected) onMeshSelect && onMeshSelect(mesh.name);
                    } else {
                      // Select all
                      if (!mesh.selected) onMeshSelect && onMeshSelect(mesh.name);
                    }
                  });
                }}
                style={{ marginRight: '6px' }}
              />
              Select All
            </label>
            <button
              type="button"
              onClick={() => {
                selectedMeshes.forEach(mesh => {
                  if (mesh.selected) onMeshSelect && onMeshSelect(mesh.name);
                });
              }}
              style={{ padding: '5px' }}
            >
              Clear
            </button>
          </div>
          <div className="mesh-list">
            {selectedMeshes.map((mesh) => (
              <div key={mesh.name} className="mesh-item">
                <label>
                  <input
                    type="checkbox"
                    checked={mesh.selected}
                    onChange={() => handleMeshCheckboxChange(mesh.name)}
                  />
                  {mesh.name}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {Array.isArray(categories) && categories.length > 0 && (
        <div className="all-categories-list">
          {categories.map((cat) => (
            <div key={cat.textureCategoryName} className="category-group">
              <div
                className="category-title"
                onClick={() => toggleCategory(cat.textureCategoryName)}
                style={{ cursor: "pointer", userSelect: "none" }}
              >
                <span style={{ marginRight: 8 }}>
                  {openCategory === cat.textureCategoryName ? "▼" : "▶"}
                </span>
                {cat.textureCategoryName}
              </div>
              {openCategory === cat.textureCategoryName && (
                <div className="asset-grid">
                  {getAllTextures(cat).map((item, idx) => (
                    <div
                      key={item.id || item.textureType || idx}
                      className="asset-item"
                      onClick={() => onSelect(item)}
                    >
                      <img
                        src={item.image || item.texture_url}
                        alt={""}
                        className="asset-image texture-image"
                      />
                      <p>
                        {item.name ||
                          item.textureType ||
                          item.textureCategoryName}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TextureSelector;
