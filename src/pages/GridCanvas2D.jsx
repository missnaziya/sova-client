import React, { useRef, useEffect, useState } from "react";
import "./css/GridCanvas2D.css";
// import "../pages/css/WallInfoPanel.css";
import { generateCorner, generateWall, drawmode, wallproperties } from "../Components/Utils/Generate";
import { useDrawing } from "../context/DrawingContext";
import WallInfoPanel from "../Components/Utils/WallInfoPanel";

const GridCanvas2D = React.forwardRef(({
  onLinesChange,
  liness,
  onCornerChange,
  cornerss,
  room,
  onChangeRooms,
}, ref) => {
  const canvasRef = useRef();
  const [lines, setLines] = useState(liness);
  const [corners, setCorners] = useState([]);
  const [tempLine, setTempLine] = useState(null);
  const [drawing, setDrawing] = useState(false);
  const [drawMode, setDrawMode] = useState(false);
  const [snapToGrid, setSnapToGrid] = useState(false);
  const [hoveredCorner, setHoveredCorner] = useState(null);
  const [selectedCorner, setSelectedCorner] = useState(null);
  const [selectedWall, setSelectedWall] = useState(null);
  const { drawingMode, currentDrawMode, setDrawingMode } = useDrawing();

  // Add debug logging
  // useEffect(() => {
  //   console.log('Drawing Mode:', drawingMode);
  //   console.log('Current Draw Mode:', currentDrawMode);
  //   console.log('Should show pencil:', drawingMode && currentDrawMode !== drawmode.move);
  // }, [drawingMode, currentDrawMode]);

  const [hoveredLine, setHoveredLine] = useState(null);
  const [selectedLine, setSelectedLine] = useState(null);
  const [deleteIcon, setDeleteIcon] = useState({
    visible: false,
    x: 0,
    y: 0,
    lineIdx: null,
  });

  const scale = useRef(0.5);
  const offset = useRef({ x: 0, y: 0 });
  const lastMousePos = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const startPoint = useRef(null);
  const gridSize = 50;

  // Add counters for interior and exterior walls
  const getNextWallNumber = (type) => {
    const count = lines.filter(wall => wall.type === type).length;
    return count + 1;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    updateCorners();
    drawGrid();
    // should be 0
  }, [lines, tempLine, snapToGrid]);

  useEffect(() => {
    const canvas = canvasRef.current;

    let debounceTimer;
    const handleWheelEvent = (e) => {
      e.preventDefault();
      const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
      scale.current *= zoomFactor;

      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        drawGrid();
      }, 10); // Or requestAnimationFrame for smoother UI
    };

    canvas.addEventListener("wheel", handleWheelEvent, { passive: false });

    return () => {
      canvas.removeEventListener("wheel", handleWheelEvent);
    };
  }, []);

  const getMousePos = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const rawX = (event.clientX - rect.left - offset.current.x) / scale.current;
    const rawY = (event.clientY - rect.top - offset.current.y) / scale.current;

    return snapToGrid
      ? {
          x: Math.round(rawX / gridSize) * gridSize,
          y: Math.round(rawY / gridSize) * gridSize,
        }
      : { x: rawX, y: rawY };
  };

  const findNearbyCorner = (pos, threshold = 10) => {
    return cornerss.find(
      (c) => Math.hypot(c.x - pos.x, c.y - pos.y) < threshold
    );
  };

  const updateCorners = () => {
    const newCornersMap = new Map();

    lines.forEach((wall) => {
      const key1 = `${wall.start.x},${wall.start.y}`;
      const key2 = `${wall.end.x},${wall.end.y}`;

      if (!newCornersMap.has(key1)) {
        newCornersMap.set(key1, {
          x: wall.start.x,
          y: wall.start.y,
          id: crypto.randomUUID(),
        });
      }
      if (!newCornersMap.has(key2)) {
        newCornersMap.set(key2, {
          x: wall.end.x,
          y: wall.end.y,
          id: crypto.randomUUID(),
        });
      }
    });

    const updatedCorners = Array.from(newCornersMap.values());
    setCorners(updatedCorners);
    onCornerChange(updatedCorners);
  };

  const detectRoomsFromLines = (liness) => {
    const adjacency = new Map();

    for (let wall of liness) {
      const key1 = `${wall.start.x},${wall.start.y}`;
      const key2 = `${wall.end.x},${wall.end.y}`;

      if (!adjacency.has(key1)) adjacency.set(key1, []);
      if (!adjacency.has(key2)) adjacency.set(key2, []);

      adjacency.get(key1).push(key2);
      adjacency.get(key2).push(key1);
    }

    const parse = (k) => {
      const [x, y] = k.split(",").map(Number);
      return { x, y };
    };

    const visited = new Set();
    const rooms = [];

    // Step 2: DFS to find cycles
    const dfs = (startKey, path, originKey) => {
      if (path.length > 20) return; // Prevent infinite loops
      visited.add(startKey);

      for (const neighbor of adjacency.get(startKey) || []) {
        if (neighbor === originKey && path.length > 2) {
          const uniquePath = [...path, startKey];
          const room = uniquePath.map(parse);
          rooms.push(room);
          continue;
        }

        if (!path.includes(neighbor)) {
          dfs(neighbor, [...path, startKey], originKey);
        }
      }
    };

    for (const key of adjacency.keys()) {
      dfs(key, [], key);
    }

    // Step 3: Remove duplicate rooms (sort-based)
    const stringify = (room) =>
      room
        .map((p) => `${p.x},${p.y}`)
        .sort()
        .join("-");
    const uniqueRoomsMap = new Map();
    for (const room of rooms) {
      const str = stringify(room);
      if (!uniqueRoomsMap.has(str)) {
        uniqueRoomsMap.set(str, room);
      }
    }

    const uniqueRooms = Array.from(uniqueRoomsMap.values());

    // Step 4: Point-in-polygon helper
    const isPointInPolygon = (point, polygon) => {
      let inside = false;
      for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const xi = polygon[i].x,
          yi = polygon[i].y;
        const xj = polygon[j].x,
          yj = polygon[j].y;

        const intersect =
          yi > point.y !== yj > point.y &&
          point.x <
            ((xj - xi) * (point.y - yi)) / (yj - yi + Number.EPSILON) + xi;
        if (intersect) inside = !inside;
      }
      return inside;
    };

    // Step 5: Filter out rooms that contain other rooms
    const outerRooms = uniqueRooms.filter((roomA, i) => {
      return !uniqueRooms.some((roomB, j) => {
        if (i === j || roomB.length >= roomA.length) return false;
        return roomB.every((pt) => isPointInPolygon(pt, roomA));
      });
    });

    return outerRooms;
  };

  // Add function to find point on line
  const findPointOnLine = (line, point) => {
    const { start, end } = line;
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    
    // Calculate projection of point onto line
    const dot = ((point.x - start.x) * dx + (point.y - start.y) * dy) / (length * length);
    
    // Find closest point on line
    const closestX = start.x + dot * dx;
    const closestY = start.y + dot * dy;
    
    // Check if point is within line segment
    const isWithinSegment = dot >= 0 && dot <= 1;
    
    return {
      point: { x: closestX, y: closestY },
      distance: Math.sqrt(
        Math.pow(point.x - closestX, 2) + Math.pow(point.y - closestY, 2)
      ),
      isWithinSegment
    };
  };

  const drawGrid = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid with every fourth line darker
    const scaledGridSize = gridSize * scale.current;
    const startX = offset.current.x % scaledGridSize;
    const startY = offset.current.y % scaledGridSize;

    // Draw vertical lines
    for (let x = startX; x < canvas.width; x += scaledGridSize) {
      ctx.beginPath();
      // Calculate absolute grid position
      const absoluteX = Math.floor((x - offset.current.x) / scaledGridSize);
      // const isFourthLine = absoluteX % 4 === 0;
      const isFourthLine = false
      ctx.strokeStyle = isFourthLine ? "rgba(136, 136, 136, 0.5)" : "rgba(0, 0, 0, 0.1)";
      ctx.lineWidth = isFourthLine ? 1.5 : 1;
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }

    // Draw horizontal lines
    for (let y = startY; y < canvas.height; y += scaledGridSize) {
      ctx.beginPath();
      // Calculate absolute grid position
      const absoluteY = Math.floor((y - offset.current.y) / scaledGridSize);
      // const isFourthLine = absoluteY % 4 === 0;
      const isFourthLine = false
      ctx.strokeStyle = isFourthLine ? "rgba(0, 0, 0, 0.5)" : "rgba(0, 0, 0, 0.1)";
      ctx.lineWidth = isFourthLine ? 1.5 : 1;
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Draw walls
    lines.forEach((wall, index) => {
      ctx.strokeStyle = index === hoveredLine ? "blue" : (wall.type === drawmode.InteriorWall ? wallproperties.interiorColor : wallproperties.exteriorColor);
      ctx.lineWidth = wall.type === drawmode.InteriorWall ? wallproperties.interiorthickness : wallproperties.exteriorthickness;

      const x1 = wall.start.x * scale.current + offset.current.x;
      const y1 = wall.start.y * scale.current + offset.current.y;
      const x2 = wall.end.x * scale.current + offset.current.x;
      const y2 = wall.end.y * scale.current + offset.current.y;

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      // Calculate length in feet and inches (1 gridSize = 1 foot)
      const lengthFeetFloat = Math.hypot(
        wall.end.x - wall.start.x,
        wall.end.y - wall.start.y
      ) / gridSize;
      const feet = Math.floor(lengthFeetFloat);
      const inches = Math.round((lengthFeetFloat - feet) * 11);
      const totalInches = (feet * 12) + inches;
      const meters = totalInches * 0.0254;
      // const text = `${feet}' ${inches}''`;
      const text = `${meters.toFixed(2)} m`;

      // Midpoint
      const midX = (x1 + x2) / 2;
      const midY = (y1 + y2) / 2;

      // Set text styles
      ctx.font = `${20 * scale.current}px Arial`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Background rectangle for text
      const padding = 4;
      const textWidth = ctx.measureText(text).width;
      const textHeight = 16 * scale.current;
      ctx.fillStyle = "white";
      ctx.fillRect(
        midX - textWidth / 2 - padding,
        midY - textHeight / 2,
        textWidth + 2 * padding,
        textHeight
      );

      // Draw text on top
      ctx.fillStyle = "black";
      ctx.fillText(text, midX, midY);
    });

    // Draw corners
    ctx.fillStyle = "blue";
    cornerss.forEach(({ x, y }) => {
      ctx.beginPath();
      ctx.arc(
        x * scale.current + offset.current.x,
        y * scale.current + offset.current.y,
        5,
        0,
        2 * Math.PI
      );
      ctx.fillStyle =
        hoveredCorner && hoveredCorner.x === x && hoveredCorner.y === y
          ? "green"
          : "blue";
      ctx.fill();
    });

    // Draw temp line
    if (tempLine) {
      const [start, end] = tempLine;

      const x1 = start.x * scale.current + offset.current.x;
      const y1 = start.y * scale.current + offset.current.y;
      const x2 = end.x * scale.current + offset.current.x;
      const y2 = end.y * scale.current + offset.current.y;

      // Draw dashed line
      ctx.strokeStyle = "blue";
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw endpoint
      ctx.beginPath();
      ctx.arc(x2, y2, 5, 0, 2 * Math.PI);
      ctx.fill();

      // Calculate length in feet and inches (1 gridSize = 1 foot)
      const lengthFeetFloat = Math.hypot(end.x - start.x, end.y - start.y) / gridSize;
      const feet = Math.floor(lengthFeetFloat);
      const inches = Math.round((lengthFeetFloat - feet) * 12);
      const text = `${feet}' ${inches}''`;

      // Midpoint
      const midX = (x1 + x2) / 2;
      const midY = (y1 + y2) / 2;

      // Set text styles
      ctx.font = `${14 * scale.current}px Arial`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Background rectangle
      const padding = 4;
      const textWidth = ctx.measureText(text).width;
      const textHeight = 16 * scale.current;
      ctx.fillStyle = "white";
      ctx.fillRect(
        midX - textWidth / 2 - padding,
        midY - textHeight / 2,
        textWidth + 2 * padding,
        textHeight
      );

      // Draw text
      ctx.fillStyle = "black";
      ctx.fillText(text, midX, midY);
    }
  };

  const handlePointerDown = (event) => {
    if (drawingMode && currentDrawMode !== drawmode.move) {
      const pos = getMousePos(event);
      
      // First check for nearby corners
      const nearbyCorner = findNearbyCorner(pos);
      if (nearbyCorner) {
        if (!drawing) {
          startPoint.current = nearbyCorner;
          setDrawing(true);
          setSelectedWall(null);
        } else {
          const dx = nearbyCorner.x - startPoint.current.x;
          const dy = nearbyCorner.y - startPoint.current.y;
          const length = Math.hypot(dx, dy);

          if (length > 50) {
            const newStart = findNearbyCorner(startPoint.current) || startPoint.current;
            const newEnd = nearbyCorner;

            const isDuplicate = lines.some(
              (wall) =>
                (wall.start.x === newStart.x &&
                  wall.start.y === newStart.y &&
                  wall.end.x === newEnd.x &&
                  wall.end.y === newEnd.y) ||
                (wall.start.x === newEnd.x &&
                  wall.start.y === newEnd.y &&
                  wall.end.x === newStart.x &&
                  wall.end.y === newStart.y)
            );

            if (!isDuplicate) {
              var startcorner = generateCorner(newStart);
              var endcorner = generateCorner(newEnd);
              const nextNumber = getNextWallNumber(currentDrawMode);
              const wallName = `${currentDrawMode === drawmode.InteriorWall ? 'Interior' : 'Exterior'} Wall ${nextNumber}`;
              const newWall = generateWall(startcorner, endcorner, currentDrawMode, wallName);
              const newLines = [...lines, newWall];
              setLines(newLines);
              onLinesChange(newLines);
              updateCorners();
            } else {
              updateCorners();
            }
          }
          startPoint.current = nearbyCorner;
        }
        return;
      }

      // Then check for nearby walls to split
      let nearestWall = null;
      let nearestPoint = null;
      let minDistance = 10; // Threshold distance

      lines.forEach((wall) => {
        const result = findPointOnLine(wall, pos);
        if (result.isWithinSegment && result.distance < minDistance) {
          minDistance = result.distance;
          nearestWall = wall;
          nearestPoint = result.point;
        }
      });

      // If we found a wall to split
      if (nearestWall && nearestPoint) {
        // Create two new walls from the split
        const newLines = lines.filter(wall => wall !== nearestWall);
        const startCorner = generateCorner(nearestWall.start);
        const endCorner = generateCorner(nearestWall.end);
        const midCorner = generateCorner(nearestPoint);

        // Add the two new walls with updated names
        const wallType = nearestWall.type;
        const nextNumber1 = getNextWallNumber(wallType);
        const nextNumber2 = nextNumber1 + 1;
        const typeStr = wallType === drawmode.InteriorWall ? 'Interior' : 'Exterior';
        const wallName1 = `${typeStr} Wall ${nextNumber1}`;
        const wallName2 = `${typeStr} Wall ${nextNumber2}`;
        
        newLines.push(
          generateWall(startCorner, midCorner, wallType, wallName1),
          generateWall(midCorner, endCorner, wallType, wallName2)
        );

        setLines(newLines);
        onLinesChange(newLines);
        updateCorners();
        
        // Detect new rooms after wall split
        const roomss = detectRoomsFromLines(newLines);
        onChangeRooms(roomss);

        // Continue drawing from the split point
        if (!drawing) {
          startPoint.current = nearestPoint;
          setDrawing(true);
        } else {
          const dx = nearestPoint.x - startPoint.current.x;
          const dy = nearestPoint.y - startPoint.current.y;
          const length = Math.hypot(dx, dy);

          if (length > 50) {
            const newStart = findNearbyCorner(startPoint.current) || startPoint.current;
            const newEnd = findNearbyCorner(nearestPoint) || nearestPoint;

            const isDuplicate = newLines.some(
              (wall) =>
                (wall.start.x === newStart.x &&
                  wall.start.y === newStart.y &&
                  wall.end.x === newEnd.x &&
                  wall.end.y === newEnd.y) ||
                (wall.start.x === newEnd.x &&
                  wall.start.y === newEnd.y &&
                  wall.end.x === newStart.x &&
                  wall.end.y === newStart.y)
            );

            if (!isDuplicate) {
              var startcorner = generateCorner(newStart);
              var endcorner = generateCorner(newEnd);
              const nextNumber = getNextWallNumber(currentDrawMode);
              const wallName = `${currentDrawMode === drawmode.InteriorWall ? 'Interior' : 'Exterior'} Wall ${nextNumber}`;
              const newWall = generateWall(startcorner, endcorner, currentDrawMode, wallName);
              const updatedLines = [...newLines, newWall];
              setLines(updatedLines);
              onLinesChange(updatedLines);
              updateCorners();
            } else {
              updateCorners();
            }
          }
          startPoint.current = nearestPoint;
        }
        return;
      }

      // Normal drawing behavior if not near a corner or wall
      if (!drawing) {
        startPoint.current = pos;
        setDrawing(true);
      } else {
        const dx = pos.x - startPoint.current.x;
        const dy = pos.y - startPoint.current.y;
        const length = Math.hypot(dx, dy);

        if (length > 50) {
          const newStart = findNearbyCorner(startPoint.current) || startPoint.current;
          const newEnd = findNearbyCorner(pos) || pos;

          const isDuplicate = lines.some(
            (wall) =>
              (wall.start.x === newStart.x &&
                wall.start.y === newStart.y &&
                wall.end.x === newEnd.x &&
                wall.end.y === newEnd.y) ||
              (wall.start.x === newEnd.x &&
                wall.start.y === newEnd.y &&
                wall.end.x === newStart.x &&
                wall.end.y === newStart.y)
          );

          if (!isDuplicate) {
            var startcorner = generateCorner(newStart);
            var endcorner = generateCorner(newEnd);
            const nextNumber = getNextWallNumber(currentDrawMode);
            const wallName = `${currentDrawMode === drawmode.InteriorWall ? 'Interior' : 'Exterior'} Wall ${nextNumber}`;
            const newWall = generateWall(startcorner, endcorner, currentDrawMode, wallName);
            const newLines = [...lines, newWall];
            setLines(newLines);
            onLinesChange(newLines);
            updateCorners();
          } else {
            updateCorners();
          }
        }
        startPoint.current = pos;
      }
    } else {
      const pos = getMousePos(event);
      const foundCorner = corners.find(
        (c) => Math.hypot(c.x - pos.x, c.y - pos.y) < 10
      );
      if (foundCorner) {
        setSelectedCorner(foundCorner);
        setSelectedWall(null);
      } else if (hoveredLine !== null) {
        setSelectedWall(lines[hoveredLine]);
        setSelectedLine(hoveredLine);
        lastMousePos.current = getMousePos(event);
      } else {
        isDragging.current = true;
        lastMousePos.current = { x: event.clientX, y: event.clientY };
        setSelectedWall(null);
      }
    }
  };

  const handlePointerMove = (event) => {
    if (drawingMode && drawing) {
      setTempLine([startPoint.current, getMousePos(event)]);
      drawGrid();
    }
    
    const pos = getMousePos(event);
    
    // Check for nearby walls to highlight
    let nearestWall = null;
    let minDistance = 10; // Same threshold as above

    lines.forEach((wall, index) => {
      const result = findPointOnLine(wall, pos);
      if (result.isWithinSegment && result.distance < minDistance) {
        minDistance = result.distance;
        nearestWall = index;
      }
    });

    setHoveredLine(nearestWall);
    setHoveredCorner(
      corners.find((c) => Math.hypot(c.x - pos.x, c.y - pos.y) < 10)
    );

    if (selectedCorner) {
      const newPos = getMousePos(event);
      setSelectedCorner(newPos);
      setLines(
        lines.map((wall) => {
          if (
            wall.start.x === selectedCorner.x &&
            wall.start.y === selectedCorner.y
          ) {
            return { ...wall, start: newPos };
          } else if (
            wall.end.x === selectedCorner.x &&
            wall.end.y === selectedCorner.y
          ) {
            return { ...wall, end: newPos };
          }
          return wall;
        })
      );

      onLinesChange(lines);
      updateCorners();

      const roomss = detectRoomsFromLines(lines);
      onChangeRooms(roomss);
    } else {
      let foundLine = null;
      liness.forEach((wall, index) => {
        const d1 = Math.hypot(wall.start.x - pos.x, wall.start.y - pos.y);
        const d2 = Math.hypot(wall.end.x - pos.x, wall.end.y - pos.y);
        const lineLen = Math.hypot(
          wall.end.x - wall.start.x,
          wall.end.y - wall.start.y
        );
        if (Math.abs(d1 + d2 - lineLen) < 5) foundLine = index;
      });
      setHoveredLine(foundLine);

      if (selectedLine !== null) {
        const dx = pos.x - lastMousePos.current.x;
        const dy = pos.y - lastMousePos.current.y;
        setLines((prevLines) => {
          const selectedWall = prevLines[selectedLine];

          return prevLines.map((wall, idx) => {
            if (idx === selectedLine) {
              return {
                ...wall,
                start: { x: wall.start.x + dx, y: wall.start.y + dy },
                end: { x: wall.end.x + dx, y: wall.end.y + dy },
              };
            }

            // Check for connections with selected wall's endpoints
            let newWall = { ...wall };
            if (
              wall.start.x === selectedWall.start.x &&
              wall.start.y === selectedWall.start.y
            ) {
              newWall.start = { x: wall.start.x + dx, y: wall.start.y + dy };
            }
            if (
              wall.end.x === selectedWall.start.x &&
              wall.end.y === selectedWall.start.y
            ) {
              newWall.end = { x: wall.end.x + dx, y: wall.end.y + dy };
            }
            if (
              wall.start.x === selectedWall.end.x &&
              wall.start.y === selectedWall.end.y
            ) {
              newWall.start = { x: wall.start.x + dx, y: wall.start.y + dy };
            }
            if (
              wall.end.x === selectedWall.end.x &&
              wall.end.y === selectedWall.end.y
            ) {
              newWall.end = { x: wall.end.x + dx, y: wall.end.y + dy };
            }
            return newWall;
          });
        });

        updateCorners();
        onLinesChange(lines);
        const roomss = detectRoomsFromLines(liness);
        onChangeRooms(roomss);
        lastMousePos.current = pos;
      }
    }

    drawGrid();
    if (!isDragging.current) return;
    offset.current.x += event.clientX - lastMousePos.current.x;
    offset.current.y += event.clientY - lastMousePos.current.y;
    lastMousePos.current = { x: event.clientX, y: event.clientY };
    // drawGrid();
  };

  const handlePointerUp = () => {
    if(drawing){
      const roomss = detectRoomsFromLines(liness);
      onChangeRooms(roomss);
    }
    isDragging.current = false;
    setSelectedCorner(null);
    setTempLine(null);
    setSelectedLine(null);
  };

  // const handleWheel = (event) => {
  //   event.preventDefault();
  //   const zoomFactor = event.deltaY > 0 ? 0.9 : 1.1;
  //   scale.current *= zoomFactor;
  //   drawGrid();
  // };

  const resetView = () => {
    scale.current = 0.5;
    offset.current = { x: 0, y: 0 };
    drawGrid();
  };

  const handleDoubleClick = () => {
    setDrawing(false);
    setTempLine(null);
    setDrawMode(false);
    setDrawingMode(false);
    startPoint.current = null;
  };

  // Right-click handler for lines
  const handleCanvasContextMenu = (event) => {
    event.preventDefault();
    const pos = getMousePos(event);
    // Find the nearest line to the click point
    let nearestLineIdx = null;
    let minDistance = 10; // px threshold
    lines.forEach((wall, idx) => {
      const result = findPointOnLine(wall, pos);
      if (result.isWithinSegment && result.distance < minDistance) {
        minDistance = result.distance;
        nearestLineIdx = idx;
      }
    });
    if (nearestLineIdx !== null) {
      setDeleteIcon({
        visible: true,
        x: event.clientX + 10,
        y: event.clientY - 30, // 30px above click
        lineIdx: nearestLineIdx,
      });
    } else {
      setDeleteIcon({ ...deleteIcon, visible: false });
    }
  };

  // Delete handler
  const handleDeleteLine = (lineIdx) => {
    const updatedLines = lines.filter((_, idx) => idx !== lineIdx);
    setLines(updatedLines);
    onLinesChange(updatedLines);
    updateCorners();
    const roomss = detectRoomsFromLines(updatedLines);
    onChangeRooms(roomss);
    setDeleteIcon({ ...deleteIcon, visible: false });
  };

  // Hide icon on click elsewhere
  useEffect(() => {
    const handleClick = () => {
      if (deleteIcon.visible) setDeleteIcon({ ...deleteIcon, visible: false });
    };
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [deleteIcon.visible]);

  React.useImperativeHandle(ref, () => ({
    get2DScreenshot: () => {
      if (canvasRef.current) {
        return canvasRef.current.toDataURL('image/png');
      }
      return '';
    },
    setLines: (newLines) => {
      setLines(newLines);
      onLinesChange(newLines);
      updateCorners();
      const roomss = detectRoomsFromLines(newLines);
      onChangeRooms(roomss);
    }
  }));

  return (
    <div className="maindivcanvas2D">
      <WallInfoPanel selectedWall={selectedWall} />
      <div className="divfortextmain">
        <button className="buttonfortext" onClick={resetView}>
          Reset View
        </button>
        {/* <button
          className="buttonfortext"
          onClick={() => setDrawMode(!drawMode)}
        >
          {drawMode ? "Stop Drawing" : "Draw Wall"}
        </button> */}
        <button
          className={"buttonfortext" + " " + (snapToGrid ? "buttonfortext_active" : "")}
          onClick={() => setSnapToGrid(!snapToGrid)}
        >
          {snapToGrid ? "Disable Snap" : "Enable Snap"}
        </button>
      </div>
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "100vh", background: "white" }}
        className={drawingMode && currentDrawMode !== drawmode.move ? "drawing-cursor" : ""}
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onMouseUp={handlePointerUp}
        onMouseLeave={handlePointerUp}
        onDoubleClick={handleDoubleClick}
        onContextMenu={handleCanvasContextMenu}
      />
      {deleteIcon.visible && (
        <button
          style={{
            position: 'fixed',
            left: deleteIcon.x,
            top: deleteIcon.y,
            // zIndex: 1000,
            background: 'white',
            border: '1px solid red',
            borderRadius: '50%',
            padding: '4px',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
          }}
          onClick={e => { e.stopPropagation(); handleDeleteLine(deleteIcon.lineIdx); }}
          onContextMenu={e => e.preventDefault()}
          title="Delete line"
        >
          🗑️
        </button>
      )}
    </div>
  );
});

export default GridCanvas2D;
