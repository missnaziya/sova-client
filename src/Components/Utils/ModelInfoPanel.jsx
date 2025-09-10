import React, { useState, useEffect } from 'react';
import "./WallInfoPanel.css";

const fields = [
  { key: 'name', label: 'Name' },
  { key: 'type', label: 'Type' },
  { key: 'size', label: 'Size' },
  // Removed width, height, depth fields from the panel
  // { key: 'width', label: 'Width' },
  // { key: 'height', label: 'Height' },
  // { key: 'depth', label: 'Depth' },
//   { key: 'scale', label: 'Scale' },
//   { key: 'gltfUrl', label: 'GLTF URL' },
//   { key: 'model_url', label: 'Model URL' },
];

const ModelInfoPanel = ({ selectedModel, onChange, isEditable = true }) => {
  const [model, setModel] = useState(selectedModel);

  useEffect(() => {
    setModel(selectedModel);
  }, [selectedModel]);

  if (!model) return null;

  const handleInputChange = (key, value) => {
    let updatedModel = { ...model };
    if (key === 'scale') {
      // Accept comma or space separated values for scale
      updatedModel.scale = value.split(/[, ]+/).map(Number);
    } else {
      updatedModel[key] = value;
    }
    setModel(updatedModel);
    if (onChange) onChange(updatedModel);
  };

  const handleSizeChange = (size) => {
    let updatedModel = { ...model };
    updatedModel.size = size;
    // Update dimensions based on selected size from size_available
    if (model.size_available && model.size_available[size]) {
      const sizeDimensions = model.size_available[size];
      updatedModel.width = sizeDimensions.width;
      updatedModel.height = sizeDimensions.height;
      updatedModel.depth = sizeDimensions.depth;
    }
    setModel(updatedModel);
    if (onChange) onChange(updatedModel);
  };

  const getCurrentSize = () => {
    return model.size || 'medium';
  };

  const getSizeOptions = () => {
    if (model.size_available) {
      return Object.keys(model.size_available).map(size => ({
        value: size,
        label: size.charAt(0).toUpperCase() + size.slice(1),
        dimensions: model.size_available[size]
      }));
    }
    // Fallback to default sizes if size_available is not present
    return [
      { value: 'small', label: 'Small', dimensions: { width: 50, height: 60, depth: 30 } },
      { value: 'medium', label: 'Medium', dimensions: { width: 80, height: 100, depth: 50 } },
      { value: 'large', label: 'Large', dimensions: { width: 120, height: 150, depth: 80 } }
    ];
  };

  const getSizeOptionLabel = (option) => {
    const { width, height, depth } = option.dimensions;
    const widthM = (width * 0.01).toFixed(2);
    const heightM = (height * 0.01).toFixed(2);
    const depthM = (depth * 0.01).toFixed(2);
    return `${option.label} (${widthM}×${heightM}×${depthM}m)`;
  };

  const sizeOptions = getSizeOptions();

  return (
    <div className="wall-info-panel">
      <div className="wall-info-content">
        {fields.map(({ key, label }) => (
          <div className="wall-info-item" key={key}>
            <label>{label}:</label>
            {isEditable ? (
              key === 'size' ? (
                <select
                  value={getCurrentSize()}
                  onChange={e => handleSizeChange(e.target.value)}
                  style={{ width: 200, padding: '2px' }}
                >
                  {sizeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {getSizeOptionLabel(option)}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={key === 'name' || key === 'type' ? 'text' : 'text'}
                  value={model[key] || ''}
                  onChange={e => handleInputChange(key, e.target.value)}
                  style={{ width: 80 }}
                />
              )
            ) : (
              key === 'size' ? (
                <select
                  value={getCurrentSize()}
                  onChange={e => handleSizeChange(e.target.value)}
                  style={{ 
                    width: 200, 
                    padding: '2px',
                    fontSize: '12px',
                    border: '1px solid #ccc',
                    borderRadius: '3px'
                  }}
                >
                  {sizeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {getSizeOptionLabel(option)}
                    </option>
                  ))}
                </select>
              ) : (
                <span style={{ 
                  color: '#333', 
                  fontWeight: '600', 
                  minWidth: '80px',
                  display: 'inline-block'
                }}>
                  {model[key] || '-'}
                </span>
              )
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModelInfoPanel; 