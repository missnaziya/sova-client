import React, { useState } from "react";
import "./AssetSelector.css";

// Static models data for demo/testing
const modelsData = [
  {
    id: "Window",
    name: "Window",
    image:
     "/static_model/image.png",
    gltfUrl: "/static_model/Gate.glb",
    width: 40,
    height: 60,
    depth: 20,
    type: "wall",
    size: "medium",
    size_available: {
      small: { width: 20, height: 40, depth: 10 },
      medium: { width: 40, height: 60, depth: 20 },
      large: { width: 60, height: 80, depth: 30 }
    }
  },
  {
    id: "door",
    name: "Door",
    image:
      "/static_model/image.png",
    gltfUrl: "/static_model/door3.glb",
    width: 40,
    height: 80,
    depth: 20,
    type: "wall",
    size: "medium",
    size_available: {
      small: { width: 20, height: 40, depth: 10 },
      medium: { width: 40, height: 60, depth: 20 },
      large: { width: 60, height: 80, depth: 30 }
    }
  },
  {
    id: "Shelve",
    name: "Closet",
    image:
     "/static_model/image2.png",
    gltfUrl: "/static_model/shelves_2.glb",
    width: 90,
    height: 160,
    depth: 40,
    type: "editable",
    size: "medium",
    size_available: {
      small: { width: 60, height: 120, depth: 30 },
      medium: { width: 90, height: 160, depth: 40 },
      large: { width: 120, height: 190, depth: 50 }
    }
  },
  {
    id: "bed",
    name: "Bed",
    image:
     "/static_model/image.png",
    gltfUrl: "/static_model/bed.glb",
    width: 60,
    height: 60,
    depth: 60,
    type: "object",
    size: "medium",
    size_available: {
      small: { width: 40, height: 40, depth: 40 },
      medium: { width: 60, height: 60, depth: 60 },
      large: { width: 80, height: 80, depth: 80 }
    }
  },
  {
    id: "helmet",
    name: "Damaged Helmet",
    image:
      "/static_model/image.png",
    gltfUrl:
      "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF/DamagedHelmet.gltf",
    width: 50,
    height: 50,
    depth: 50,
    type: "editable",
    size: "medium",
    size_available: {
      small: { width: 30, height: 30, depth: 30 },
      medium: { width: 50, height: 50, depth: 50 },
      large: { width: 70, height: 70, depth: 70 }
    }
  },
  {
    id: "box",
    name: "Box",
    image:
      "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Box/screenshot/screenshot.jpg",
    gltfUrl:
      "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Box/glTF/Box.gltf",
    width: 100,
    height: 100,
    depth: 100,
    type: "wall",
    size: "medium",
    size_available: {
      small: { width: 60, height: 60, depth: 60 },
      medium: { width: 100, height: 100, depth: 100 },
      large: { width: 140, height: 140, depth: 140 }
    }
  },
];

// Group models by category (wall items and floor items)
const groupModelsByCategory = (models) => [
  {
    name: "Wall Items",
    items: models.filter((item) => item.type === "wall"),
  },
  {
    name: "Floor Items",
    items: models.filter((item) => item.type === "object" || item.type === "editable"),
  },
];

const AssetSelector = ({
  onClose,
  onSelect,
  title = "Select Asset",
  type = "texture", // can be 'texture' or 'model'
  categories, // array of {category, items} or {category, subcategories}
}) => {
  // If type is 'model' and no categories provided, use static modelsData
  let displayCategories = categories;
  if (type === "model" && (!categories || categories.length === 0)) {
    displayCategories = groupModelsByCategory(modelsData);
  }

  // State for open/close of categories and subcategories
  const [openCategories, setOpenCategories] = useState({});
  const [openSubCategories, setOpenSubCategories] = useState({});

  const toggleCategory = (catName) => {
    setOpenCategories((prev) => {
      const isOpen = prev[catName];
      // If already open, close all
      if (isOpen) {
        return {};
      }
      // Open only this one
      return { [catName]: true };
    });
    // Optionally, close all subcategories when switching category
    setOpenSubCategories({});
  };

  const toggleSubCategory = (catName, subName) => {
    setOpenSubCategories((prev) => {
      const key = `${catName}__${subName}`;
      const isOpen = prev[key];
      if (isOpen) {
        return {};
      }
      // Only this subcategory open
      return { [key]: true };
    });
  };

  return (
    <div className="asset-selector">
      <div className="asset-header">
        <h5>{title}</h5>
        <button onClick={onClose}>×</button>
      </div>
      {Array.isArray(displayCategories) && displayCategories.length > 0 && (
        <div className="all-categories-list">
          {displayCategories.map((cat) => (
            <div key={cat.name} className="category-group">
              <div
                className="category-title"
                onClick={() => toggleCategory(cat.name)}
                style={{ cursor: "pointer", userSelect: "none" }}
              >
                <span style={{ marginRight: 8 }}>
                  {openCategories[cat.name] ? "▼" : "▶"}
                </span>
                {cat.name}
              </div>
              {openCategories[cat.name] &&
                (cat.subCategories ? (
                  <div className="all-subcategories-list">
                    {cat.subCategories.map((sub) => (
                      <div key={sub.name} className="subcategory-group">
                        <div
                          className="subcategory-title"
                          onClick={() => toggleSubCategory(cat.name, sub.name)}
                          style={{ cursor: "pointer", userSelect: "none" }}
                        >
                          <span style={{ marginRight: 8 }}>
                            {openSubCategories[`${cat.name}__${sub.name}`]
                              ? "▼"
                              : "▶"}
                          </span>
                          {sub.name}
                        </div>
                        {openSubCategories[`${cat.name}__${sub.name}`] && (
                          <div className="asset-grid">
                            {sub.data &&
                              sub.data.map((item) => (
                                <div
                                  key={item.id}
                                  className="asset-item"
                                  onClick={() => onSelect(item)}
                                >
                                  <img
                                    src={item.image2d_url}
                                    alt=""
                                    className={`asset-image ${type}-image`}
                                  />
                                  <p>{item.name}</p>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="asset-grid">
                    {cat.items.map((item) => (
                      <div
                        key={item.id}
                        className="asset-item"
                        onClick={() => onSelect(item)}
                      >
                        <img
                          src={item.image}
                          alt={""}
                          className={`asset-image ${type}-image`}
                        />
                        <p>{item.name}</p>
                      </div>
                    ))}
                  </div>
                ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AssetSelector;
