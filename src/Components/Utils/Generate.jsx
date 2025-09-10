// utils.js

// ID counters
let idCounters = {};

export const drawmode = {
  move: 0,
  InteriorWall: 1,
  ExteriorWall: 2,
};
export const wallproperties = {
  interiorthickness:4,
  exteriorthickness:6,
  inetrior2Dthickness:2,
  exterior2Dthickness:3,
  interiorColor: "#42ff33",  // Blue for interior
  exteriorColor: "#ff7a33",  // Red for exterior
 
};
// general unique id generator
export function generateUniqueId(prefix) {
  if (!(prefix in idCounters)) {
    idCounters[prefix] = 0;
  }
  return `${prefix}-${idCounters[prefix]++}`;
}

// generate corner based on position
export function generateCorner(point) {
  return {
    id: generateUniqueId("corner"),
    x: point.x,
    y: point.y,
  };
}

// generate wall based on two corners
export function generateWall(
  start,
  end,
  type = drawmode.InteriorWall,  // Default to InteriorWall
  name,
  isSelected = false,
  thichknes = 8,
  height = 118
) {
  const id = generateUniqueId("wall");
  return {
    id,
    name: name || ((type === drawmode.InteriorWall ? "Interior" : "Exterior") || `Wall ${id.split("-")[1]}`),
    type: type,  // This should be either drawMode.InteriorWall or drawMode.ExteriorWall
    start,
    end,
    isSelected: isSelected,
    thichknes: type === drawmode.InteriorWall ? wallproperties.interiorthickness : wallproperties.exteriorthickness,
    height: height,
 
  };
}
