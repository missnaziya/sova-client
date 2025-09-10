import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import WallInfoPanel from "../Components/Utils/WallInfoPanel";
import "./css/GridCanvas3D.css";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import AssetSelector from "../Components/Utils/AssetSelector";
import TextureSelector from "../Components/Utils/TextureSelector";
import { fetchAllModels } from "../apis/authApis/modelsApi";
import { fetchAllTextures } from "../apis/authApis/texturesApi";
import LoadedItems from "../Components/Utils/LoadedItems";
import { createScene } from "../Components/Utils/threeUtils/createScene";
import { createRenderer } from "../Components/Utils/threeUtils/createRenderer";
import { createCamera } from "../Components/Utils/threeUtils/createCamera";
import { createControls } from "../Components/Utils/threeUtils/createControls";
import { addLights } from "../Components/Utils/threeUtils/addLights";
import { findDrawingCenter } from "../Components/Utils/threeUtils/findDrawingCenter";
import { addGridHelper } from "../Components/Utils/threeUtils/addGridHelper";
import ModelInfoPanel from '../Components/Utils/ModelInfoPanel';
import '../Components/Utils/ModelInfoPanel.css';
import { addModelToScene, moveModel } from "../Components/Utils/threeUtils/threeModelUtils";
import { CSG } from 'three-csg-ts';


// Helper to get intersection of mouse with XZ plane at given Y
function getMouseIntersectionWithXZPlane(event, camera, renderer, y = 0) {
  const rect = renderer.domElement.getBoundingClientRect();
  const mouse = new THREE.Vector2(
    ((event.clientX - rect.left) / rect.width) * 2 - 1,
    -((event.clientY - rect.top) / rect.height) * 2 + 1
  );
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);
  const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -y);
  const intersection = new THREE.Vector3();
  raycaster.ray.intersectPlane(plane, intersection);
  return intersection;
}

const GridCanvas3D = React.forwardRef(({
  lines,
  roomss,
  selectedModel,
  loadedModels = [],
  setShowModels,
  setShowTextures,
  showModels,
  showTextures,
  modelCategories,
  textureCategories,
  isLoading,
  onLinesChange,
}, ref) => {
  const containerRef = useRef(null);
  const controlsRef = useRef(null);
  const cameraRef = useRef(null);
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());
  const selectedWallRef = useRef(null);
  const wallMeshes = useRef([]);
  const selectionBox = useRef(null);
  let selectedModels3D = null;
  let initialModelsPosition=new THREE.Vector3();
  let isDraggingModels = false;
  let mouseDownPositionModels=new THREE.Vector2();
  const modelSelectionBox = useRef(null);
  const [selectedWall, setSelectedWall] = useState(null);
  const [selectedModel3D, setSelectedModel3D] = useState(null);
  const sceneRef = useRef(null);
  const modelMeshes = useRef([]);
  const [loadedModelObjects, setLoadedModelObjects] = useState([]);
  const [mouseDownPosition, setMouseDownPosition] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [initialModelPosition, setInitialModelPosition] = useState(null);
  const [dragStartPoint, setDragStartPoint] = useState(null);
  const [initialModelsPositionState, setInitialModelsPositionState] = useState(null);
  const dragStartPointRef = useRef(null);
  const initialModelsPositionStateRef = useRef(null);
  const [selectedMeshes, setSelectedMeshes] = useState([]);
  const [isModelInfoEditable, setIsModelInfoEditable] = useState(true);
  const floorMeshes = useRef([]);
  const roofMeshes = useRef([]);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [highlightedFloor, setHighlightedFloor] = useState(null);
  const floorSelectionBox = useRef(null);
  const floorOverlayMesh = useRef(null);
  const activeWallIndexRef = useRef(0);
  const [deleteModelIcon, setDeleteModelIcon] = useState({
    visible: false,
    x: 0,
    y: 0,
    model: null,
  });
  const initialModelYRef = useRef(0);
  const initialMouseYRef = useRef(0);
  const rendererRef = useRef(null);
  const [roofsVisible, setRoofsVisible] = useState(false);

  // Function to determine if model info should be editable based on conditions
  const shouldModelBeEditable = (model) => {
    if (!model) return false;
    
    // Example conditions - customize based on your requirements
    const conditions = {
      // Allow editing if model type is 'custom' or 'user_created'
      allowCustomModels: model.type === 'custom' || model.type === 'user_created',
      
      // Allow editing if model has edit permissions
      hasEditPermissions: model.canEdit !== false,
      
      // Allow editing if model is not locked
      isNotLocked: !model.isLocked,
      
      // Allow editing if user has admin role (example)
      isAdmin: model.userRole === 'admin',
      
      // Allow editing if model is not from a protected category
      isNotProtected: !['system', 'premium', 'locked'].includes(model.category)
    };
    
    // Debug: Log conditions for the selected model
    if (model.name) {
      console.log('Model editability conditions for:', model.name, conditions);
    }
    
    // Return true if any condition is met (OR logic)
    // Change to AND logic if you want all conditions to be true
    return Object.values(conditions).some(condition => condition === true);
    
    /*
    Example model data for testing:
    
    // Editable model examples:
    { name: "Custom Chair", type: "custom", canEdit: true, isLocked: false }
    { name: "User Table", type: "user_created", category: "furniture" }
    { name: "Admin Model", userRole: "admin", type: "system" }
    
    // Non-editable model examples:
    { name: "System Model", type: "system", canEdit: false, isLocked: true }
    { name: "Premium Model", category: "premium", canEdit: false }
    { name: "Locked Model", isLocked: true, type: "standard" }
    */
  };

  let renderer, scene, controls, camera, center;

  const performSelection = (event) => {
    const renderer = containerRef.current && containerRef.current.firstChild && containerRef.current.firstChild.tagName === 'CANVAS' ? containerRef.current.firstChild : null;
    const camera = cameraRef.current;
    const scene = sceneRef.current;
    if (!renderer || !camera) return;

    const rect = renderer.getBoundingClientRect();
    mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.current.setFromCamera(mouse.current, camera);
    const intersects = raycaster.current.intersectObjects(wallMeshes.current);
    console.log(intersects);
    // Remove previous selection box if any
    if (selectionBox.current) {
      scene.remove(selectionBox.current);
      selectionBox.current.geometry.dispose();
      selectionBox.current.material.dispose();
      selectionBox.current = null;
    }

    if (intersects.length > 0) {
      const selected = intersects[0].object;
      selectedWallRef.current = selected;
      setSelectedFloor(null);
      setSelectedWall(selected.userData.wallData);

      // Use geometry parameters if available, otherwise fallback to bounding box
      let width, height, depth;
      if (selected.geometry.parameters) {
        ({ width, height, depth } = selected.geometry.parameters);
      } else {
        // Fallback: use bounding box
        const box = new THREE.Box3().setFromObject(selected);
        const size = new THREE.Vector3();
        box.getSize(size);
        width = size.x;
        height = size.y;
        depth = size.z;
      }
      const edgeGeometry = new THREE.EdgesGeometry(
        new THREE.BoxGeometry(width, height, depth)
      );
      const edgeMaterial = new THREE.LineBasicMaterial({
        color: 0xff0000,
        linewidth: 5,
      });
      const wireBox = new THREE.LineSegments(edgeGeometry, edgeMaterial);

      // Match position and rotation
      wireBox.position.copy(selected.position);
      wireBox.rotation.copy(selected.rotation);
      scene.add(wireBox);

      selectionBox.current = wireBox;
    } else {
      selectedWallRef.current = null;
      setSelectedWall(null);
    }

    // Model picking logic
    const modelIntersects = raycaster.current.intersectObjects(
      modelMeshes.current,
      true
    );
    console.log(modelIntersects);
    if (modelIntersects.length > 0) {
      console.log(modelIntersects[0]);
      const selectedModel = modelIntersects[0].object.parent;
      setSelectedModel3D(selectedModel);
      selectedModels3D = selectedModel;
      console.log(selectedModel);
      // Remove previous model selection box if any
      console.log(selectedModel3D);
      console.log(modelMeshes.current);
      if (modelSelectionBox.current) {
        scene.remove(modelSelectionBox.current);
        modelSelectionBox.current.geometry.dispose();
        modelSelectionBox.current.material.dispose();
        modelSelectionBox.current = null;
      }
      // Compute bounding box for the selected model
      const box = new THREE.Box3().setFromObject(selectedModel);
      const size = new THREE.Vector3();
      box.getSize(size);
      const center = new THREE.Vector3();
      box.getCenter(center);
      // Create a wireframe box
      const boxGeometry = new THREE.BoxGeometry(size.x, size.y, size.z);
      const boxMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 });
      const wireBox = new THREE.LineSegments(
        new THREE.EdgesGeometry(boxGeometry),
        boxMaterial
      );
      wireBox.position.copy(center);
      scene.add(wireBox);
      modelSelectionBox.current = wireBox;
    }else{
      setSelectedModel3D(null);
      selectedModels3D = null;
      if (modelSelectionBox.current) {
        scene.remove(modelSelectionBox.current);
        modelSelectionBox.current.geometry.dispose();
        modelSelectionBox.current.material.dispose();
        modelSelectionBox.current = null;
      }
    }

    // Floor picking logic
    const floorIntersects = raycaster.current.intersectObjects(floorMeshes.current);
    console.log(floorIntersects);
    if (floorIntersects.length > 0) {
      const selected = floorIntersects[0].object;
      console.log(selected);
      setSelectedFloor(selected);
      // Remove previous highlight
      if (floorSelectionBox.current) {
        scene.remove(floorSelectionBox.current);
        floorSelectionBox.current.geometry.dispose();
        floorSelectionBox.current.material.dispose();
        floorSelectionBox.current = null;
      }
      if (floorOverlayMesh.current) {
        scene.remove(floorOverlayMesh.current);
        floorOverlayMesh.current.geometry.dispose();
        floorOverlayMesh.current.material.dispose();
        floorOverlayMesh.current = null;
      }
      // Add wireframe highlight (outline)
      if (selected.geometry) {
        let edgeGeometry, edgeMaterial, wireBox;
        if (selected.geometry.type === 'ShapeGeometry') {
          edgeGeometry = new THREE.EdgesGeometry(selected.geometry);
          edgeMaterial = new THREE.LineBasicMaterial({ color: 0xffff00 }); // bright yellow
          wireBox = new THREE.LineSegments(edgeGeometry, edgeMaterial);
          wireBox.position.copy(selected.position);
          wireBox.rotation.copy(selected.rotation);
        } else {
          edgeGeometry = new THREE.EdgesGeometry(selected.geometry);
          edgeMaterial = new THREE.LineBasicMaterial({ color: 0xffff00 });
          wireBox = new THREE.LineSegments(edgeGeometry, edgeMaterial);
          wireBox.position.copy(selected.position);
          wireBox.rotation.copy(selected.rotation);
        }
        scene.add(wireBox);
        floorSelectionBox.current = wireBox;
        // Add semi-transparent overlay
        const overlayMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00, transparent: true, opacity: 0.9, depthWrite: false });
        const overlayMesh = new THREE.Mesh(selected.geometry.clone(), overlayMaterial);
        overlayMesh.position.copy(selected.position);
        overlayMesh.rotation.copy(selected.rotation);
        scene.add(overlayMesh);
        floorOverlayMesh.current = overlayMesh;
      }
      setHighlightedFloor(selected);
    } else {
      if (floorSelectionBox.current) {
        scene.remove(floorSelectionBox.current);
        floorSelectionBox.current.geometry.dispose();
        floorSelectionBox.current.material.dispose();
        floorSelectionBox.current = null;
      }
      if (floorOverlayMesh.current) {
        scene.remove(floorOverlayMesh.current);
        floorOverlayMesh.current.geometry.dispose();
        floorOverlayMesh.current.material.dispose();
        floorOverlayMesh.current = null;
      }
      setSelectedFloor(null);
      setHighlightedFloor(null);
    }
  };

  const onMouseDown = (event) => {
   
    setMouseDownPosition({ x: event.clientX, y: event.clientY });
    mouseDownPositionModels.set(event.clientX, event.clientY);

    const renderer = containerRef.current && containerRef.current.firstChild && containerRef.current.firstChild.tagName === 'CANVAS' ? containerRef.current.firstChild : null;
    const camera = cameraRef.current;
    if (!renderer || !camera) return;

    const rect = renderer.getBoundingClientRect();
    mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.current.setFromCamera(mouse.current, camera);
    console.log(modelMeshes.current);
    const modelIntersects = raycaster.current.intersectObjects(modelMeshes.current, true);
    
    let modelToDrag = null;
    if (modelIntersects.length > 0) {
      console.log(modelIntersects[0]);
      modelToDrag = modelIntersects[0].object.parent;
      setSelectedWall(null);
      setSelectedFloor(null);
      setSelectedModel3D(modelToDrag); // for UI highlight
     
      selectedModels3D=modelToDrag;
    } else {
      setSelectedModel3D(null);
      performSelection(event);
    }

    if (modelToDrag && modelToDrag.userData && modelToDrag.userData.type === 'wall') {
      initialModelYRef.current = modelToDrag.position.y;
      initialMouseYRef.current = event.clientY;
    }

    if (modelToDrag) {
      setIsDragging(true);
      isDraggingModels=true;
      const intersection = getMouseIntersectionWithXZPlane(event, camera, { domElement: renderer }, modelToDrag.position.y);
      dragStartPointRef.current = intersection.clone();
      initialModelsPositionStateRef.current = modelToDrag.position.clone();
      setDragStartPoint(intersection.clone());
      setInitialModelsPositionState(modelToDrag.position.clone());
    } else {
      setIsDragging(false);
      dragStartPointRef.current = null;
      initialModelsPositionStateRef.current = null;
      setDragStartPoint(null);
      setInitialModelsPositionState(null);
    }
    
  };

  const onMouseMove = (event) => {
    // console.log(selectedModel3D);
    // console.log(dragStartPoint);
    // console.log(initialModelsPositionState);

    // console.log(isDragging);
    // console.log(dragStartPointRef.current);
    // console.log(initialModelsPositionStateRef.current);
      
    if (!isDraggingModels || !selectedModels3D || !dragStartPointRef.current || !initialModelsPositionStateRef.current) return;
    const renderer = containerRef.current.firstChild;
    const camera = cameraRef.current;
    const intersection = getMouseIntersectionWithXZPlane(event, camera, { domElement: renderer }, initialModelsPositionStateRef.current.y);
    if (intersection) {
      const delta = intersection.clone().sub(dragStartPointRef.current);
      // If dragging a wall-type model, raycast to find the wall under the mouse
      let wallIdx = activeWallIndexRef.current;
      let yOffset = undefined;
      if (selectedModels3D.userData && selectedModels3D.userData.type === 'wall') {
        const rect = renderer.getBoundingClientRect();
        mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.current.setFromCamera(mouse.current, camera);
        const wallIntersects = raycaster.current.intersectObjects(wallMeshes.current);
        if (wallIntersects.length > 0) {
          const idx = wallMeshes.current.indexOf(wallIntersects[0].object);
          if (idx !== -1 && idx !== activeWallIndexRef.current) {
            activeWallIndexRef.current = idx;
            wallIdx = idx;
          }
        }
        // Calculate vertical movement
        const mouseYDelta = event.clientY - initialMouseYRef.current;
        // Convert pixel delta to world units (adjust 0.5 as needed for your scene scale)
        const wallForMove = lines[wallIdx];
        const wallHeight = wallForMove.height || 118;
        let yDelta = mouseYDelta * 0.5; // Adjust this factor for your scene
        let newY = initialModelYRef.current - yDelta;
        // Clamp newY between wall base and wall top
        const wallBase = 0;
        const wallTop = wallHeight;
        newY = Math.max(wallBase, Math.min(wallTop, newY));
        yOffset = newY;
      }
      // Use helper to move model with constraints, using the wall at wallIdx and yOffset
      const wallForMove = lines[wallIdx];
      moveModel(selectedModels3D, initialModelsPositionStateRef.current, delta, wallForMove, yOffset);
      const box = new THREE.Box3().setFromObject(selectedModels3D);
      const size = new THREE.Vector3();
      box.getSize(size);
      const center = new THREE.Vector3();
      box.getCenter(center);
      modelSelectionBox.current.position.copy(center);
      if (selectedModels3D.userData && selectedModels3D.userData.type === 'wall') {
        modelSelectionBox.current.rotation.y = selectedModels3D.rotation.y + Math.PI / 2;
      }
    }
  };

  const onMouseUp = (event) => {
    setMouseDownPosition(null);
    mouseDownPositionModels.set(null, null);
    setIsDragging(false);
    dragStartPointRef.current = null;
    initialModelsPositionStateRef.current = null;
    setDragStartPoint(null);
    setInitialModelsPositionState(null);
  };

  useEffect(() => {
    if (!containerRef.current) return;

    // Find drawing center
    center = findDrawingCenter(lines);

    // Scene setup
    scene = createScene();
    sceneRef.current = scene;
    window._sova_scene3d = scene;
    camera = createCamera(window.innerWidth, window.innerHeight, center);
    cameraRef.current = camera;
    renderer = createRenderer(window.innerWidth, window.innerHeight);
    rendererRef.current = renderer;
    containerRef.current.appendChild(renderer.domElement);
    controls = createControls(camera, renderer.domElement, center);
    controlsRef.current = controls;
    addGridHelper(scene);
    addLights(scene);

    // Wall creator
    const addWall = (start, end, line) => {
      const wallHeight = line.height || 118;
      const wallThickness = line.thichknes || 2;
      const dx = end.x - start.x;
      const dy = end.y - start.y;
      const length = Math.sqrt(dx * dx + dy * dy);

      const geometry = new THREE.BoxGeometry(
        length + 0.1,
        wallHeight,
        wallThickness
      );
      const material = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.2,
        metalness: 0,
      });
      const wall = new THREE.Mesh(geometry, material);
      wall.userData.wallData = line;
      wall.castShadow = true;
      wall.receiveShadow = true;
      wall.position.set(
        (start.x + end.x) / 2,
        wallHeight / 2,
        (start.y + end.y) / 2
      );
      const angle = Math.atan2(dy, dx);
      wall.rotation.y = -angle;
      scene.add(wall);
      wallMeshes.current.push(wall);
    };

    // Create walls
    lines.forEach((wall) => addWall(wall.start, wall.end, wall));

    // Floor creator for rooms
    const addRoomFloor = (points2D) => {
      // Convert 2D (x, y) → Shape in XZ plane
      const shape = new THREE.Shape();
      shape.moveTo(points2D[0].x, points2D[0].y);
      for (let i = 1; i < points2D.length; i++) {
        shape.lineTo(points2D[i].x, points2D[i].y);
      }
      shape.lineTo(points2D[0].x, points2D[0].y); // close loop

      const geometry = new THREE.ShapeGeometry(shape);
      const material = new THREE.MeshStandardMaterial({
        color: 0xfffff0,
        side: THREE.DoubleSide,
      });

      const floor = new THREE.Mesh(geometry, material);
      floor.rotation.x = Math.PI / 2; // XZ plane
      floor.position.set(0, 5, 0); // Z from 2D y, Y = 0 for ground

      scene.add(floor);
      floorMeshes.current.push(floor);
    };

    // Add room floors
    roomss.forEach((room) => {
      addRoomFloor(room);
    });

    // Axes
    const xAxis = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-20000 / 2, 0, 0),
        new THREE.Vector3(20000 / 2, 0, 0),
      ]),
      new THREE.LineBasicMaterial({ color: 0xff0000 })
    );
    scene.add(xAxis);

    const zAxis = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, -20000 / 2),
        new THREE.Vector3(0, 0, 20000 / 2),
      ]),
      new THREE.LineBasicMaterial({ color: 0x0000ff })
    );
    scene.add(zAxis);

    // Attach mouse event listeners to the canvas after it is appended
    const canvas = renderer.domElement;
    if (canvas) {
      canvas.addEventListener('mousedown', onMouseDown);
      canvas.addEventListener('mousemove', onMouseMove);
      canvas.addEventListener('mouseup', onMouseUp);
    }

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Resize handling
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      if (canvas) {
        canvas.removeEventListener('mousedown', onMouseDown);
        canvas.removeEventListener('mousemove', onMouseMove);
        canvas.removeEventListener('mouseup', onMouseUp);
      }
      controls.dispose();
      renderer.dispose();
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, [lines, loadedModels]);

  
  // Reset Camera
  const resetView = () => {
    if (cameraRef.current && controlsRef.current) {
      let center = new THREE.Vector3(0, 0, 0);
      if (lines.length > 0) {
        let minX = Infinity,
          maxX = -Infinity,
          minY = Infinity,
          maxY = -Infinity;
        lines.forEach((wall) => {
          minX = Math.min(minX, wall.start.x, wall.end.x);
          maxX = Math.max(maxX, wall.start.x, wall.end.x);
          minY = Math.min(minY, wall.start.y, wall.end.y);
          maxY = Math.max(maxY, wall.start.y, wall.end.y);
        });
        const centerX = (minX + maxX) / 2;
        const centerY = (minY + maxY) / 2;
        center = new THREE.Vector3(centerX, 0, centerY);
      }

      cameraRef.current.position.set(
        center.x + 200,
        center.y + 200,
        center.z + 200
      );
      cameraRef.current.lookAt(center);
      controlsRef.current.target.copy(center);
      controlsRef.current.update();
    }
  };

  // Add roof/floor for all rooms (now only for roofs)
  const addRoomRoof = () => {
    if (!sceneRef.current || !roomss) return;
    removeRoomRoofs();
    roomss.forEach((room) => {
      if (room && room.length > 0) {
        // Find max wall height for this room
        let maxHeight = 0;
        for (let i = 0; i < room.length; i++) {
          const start = room[i];
          const end = room[(i + 1) % room.length];
          // Find the wall in lines that matches this edge
          const wall = lines.find(
            w =>
              (w.start.x === start.x && w.start.y === start.y && w.end.x === end.x && w.end.y === end.y) ||
              (w.start.x === end.x && w.start.y === end.y && w.end.x === start.x && w.end.y === start.y)
          );
          if (wall) {
            maxHeight = Math.max(maxHeight, wall.height || 118);
          }
        }
        if (maxHeight === 0) maxHeight = 118; // fallback

        // Create the roof mesh
        const shape = new THREE.Shape();
        shape.moveTo(room[0].x, room[0].y);
        for (let i = 1; i < room.length; i++) {
          shape.lineTo(room[i].x, room[i].y);
        }
        shape.lineTo(room[0].x, room[0].y); // close loop
        const geometry = new THREE.ShapeGeometry(shape);
        const material = new THREE.MeshStandardMaterial({
          color: 0xffe0e0,
          side: THREE.DoubleSide,
        });
        const roof = new THREE.Mesh(geometry, material);
        roof.rotation.x = Math.PI / 2;
        roof.position.set(0, maxHeight, 0); // Y = max wall height
        sceneRef.current.add(roof);
        roofMeshes.current.push(roof);
      }
    });
  };

  // Remove all roofs/floors (now only for roofs)
  const removeRoomRoofs = () => {
    if (!sceneRef.current) return;
    roofMeshes.current.forEach((mesh) => {
      sceneRef.current.remove(mesh);
      if (mesh.geometry) mesh.geometry.dispose();
      if (mesh.material) mesh.material.dispose();
    });
    roofMeshes.current = [];
  };

  // Add or remove roofs/floors for all rooms
  const toggleRoomRoofs = () => {
    if (roofsVisible) {
      removeRoomRoofs();
      setRoofsVisible(false);
    } else {
      addRoomRoof();
      setRoofsVisible(true);
    }
  };

  // Dummy handlers for selection (customize as needed)
  const handleModelSelect = (model) => {
    // setShowModels(false);
    console.log(model);
    if (!model) return;
  
    if (!sceneRef.current) return;
    const loader = new GLTFLoader();
    loader.crossOrigin = 'anonymous';
  
   
    let modelUrl = model.gltfUrl || model.model_url;
    // Only use proxy for remote URLs
    // if (modelUrl && (modelUrl.startsWith('http://') || modelUrl.startsWith('https://'))) {
    //   modelUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(modelUrl)}`;
    // }
    console.log(modelUrl);
    loader.load(
      modelUrl,
      (gltf) => {
        let obj = gltf.scene;
        console.log("Loaded GLTF:", obj);

        // Log bounding box
        const box = new THREE.Box3().setFromObject(obj);
        console.log("Model bounding box:", box);

        // Calculate scale based on model dimensions if provided
        let scale = [1, 1, 1];
        const boxSize = new THREE.Vector3();
        box.getSize(boxSize);
        // Store original bounding box size for later scaling
        obj.userData._originalBoxSize = boxSize.clone();
        // Model properties: width (x), height (y), depth (z)
        if (model.width && model.height && model.depth) {
          scale = [
            model.width / (boxSize.x || 1),
            model.height / (boxSize.y || 1),
            (model.depth) / (boxSize.z || 1),
          ];
          obj.scale.set(...scale);
        } else if (model.scale) {
          obj.scale.set(...model.scale);
        } else {
          obj.scale.set(200, 200, 200); // fallback
        }

        // --- Positioning Logic --- 
        // Recalculate drawing center just before positioning
        let drawingCenter = findDrawingCenter(lines);
        if (!drawingCenter) {
          drawingCenter = new THREE.Vector3(0, 0, 0);
        }

        // Calculate the model's current center relative to its local origin
        const centerOffset = box.getCenter(new THREE.Vector3());
        
        // Position the model by placing its origin at the drawing center,
        // then offsetting it by the negative of its center offset to align the bounding box center
        // with the drawing center, and finally adding a slight elevation (10).
        obj.position.set(
          drawingCenter.x - centerOffset.x,
          10 - centerOffset.y,
          drawingCenter.z - centerOffset.z
        );

        // Add a debug box at the same position
        const debugBox = new THREE.Mesh(
          new THREE.BoxGeometry(20, 20, 20),
          new THREE.MeshStandardMaterial({ color: 0xff0000, wireframe: true })
        );
        // debugBox.position.copy(obj.position);
        // scene.add(debugBox);
        console.log(obj.position);
        // Traverse and force all mesh materials to be visible and green
        let meshFound = false;
        if (!meshFound) {
          console.warn("No mesh found in loaded model!");
        }

        obj.userData = { ...model };
        // Store both info and gltf object
        setLoadedModelObjects((prev) => [...prev, { info: model, gltf: obj }]);
        // Special logic for wall-type models: embed in wall and cut hole
        if (model.type === "wall" && wallMeshes.current.length > 0 && lines && lines.length > 0) {
          // Find the wall mesh and wall data that the model should be embedded in
          // Default to the first wall, but if user is dragging, use the wall under the pointer
          let wallIdx = 0;
          if (activeWallIndexRef && typeof activeWallIndexRef.current === 'number') {
            wallIdx = activeWallIndexRef.current;
          }
          const wallMesh = wallMeshes.current[wallIdx];
          const wall = lines[wallIdx];
          const start = wall.start;
          const end = wall.end;
          const dx = end.x - start.x;
          const dy = end.y - start.y;
          const centerX = (start.x + end.x) / 2;
          const centerZ = (start.y + end.y) / 2;
          const wallHeight = wall.height || 118;

          // Place the model inside the wall (centered, at mid-height)
          obj.position.set(centerX, wallHeight / 2, centerZ);
          const angle = -Math.atan2(dy, dx);
          obj.rotation.y = angle;

          // CSG: Subtract the model from the wall
          wallMesh.updateMatrixWorld();
          obj.updateMatrixWorld();

          // Use only the first mesh in obj for CSG (if obj is a group)
          let csgTarget = obj;
          if (obj.type === 'Group' && obj.children.length > 0) {
            // Find the first mesh child
            csgTarget = obj.children.find(child => child.isMesh) || obj.children[0];
          }

          const wallBsp = CSG.fromMesh(wallMesh);
          const objBsp = CSG.fromMesh(csgTarget);
          const subtractedBsp = wallBsp.subtract(objBsp);
          const newWallMesh = CSG.toMesh(subtractedBsp, wallMesh.matrix, wallMesh.material);

          // Copy over userData and other important properties
          newWallMesh.userData = { ...wallMesh.userData };
          newWallMesh.name = wallMesh.name;
          newWallMesh.rotation.y = wallMesh.rotation.y;
          
          // Replace the wall mesh in the scene and wallMeshes array
          wallMesh.parent.add(newWallMesh);
          wallMesh.parent.remove(wallMesh);
          wallMeshes.current[wallIdx] = newWallMesh;

          // If you have a selectedWallRef or similar, update it if needed
          if (selectedWallRef.current === wallMesh) {
            selectedWallRef.current = newWallMesh;
          }

          // After cut, ensure the model is set to the same position and rotation as the wall
          obj.position.set(centerX, wallHeight / 2, centerZ);
          obj.rotation.y = angle;

          // Add the wall-type model to the scene and modelMeshes only (not wallMeshes)
          sceneRef.current.add(obj);
          modelMeshes.current.push(obj);
          console.log("Wall-type model embedded and wall cut with CSG.");
        } else {
          // Use helper to add model to scene and correct mesh array
          addModelToScene(sceneRef.current, model, obj, wallMeshes.current, modelMeshes.current);
        }
        console.log("Scene after adding model:", scene);

        // Camera focus
        if (camera && controls) {
          // Adjust camera target to the model's new world position
          const modelWorldPosition = new THREE.Vector3();
          obj.getWorldPosition(modelWorldPosition);
          camera.position.set(modelWorldPosition.x + 200, 200, modelWorldPosition.z + 200);
          camera.lookAt(modelWorldPosition);
          controls.target.copy(modelWorldPosition);
          controls.update();
        }
      },
      undefined,
      (error) => {
        console.error("Error loading model:", error);
      }
    );

    // You can add logic to add the model to the scene here
  };

  // Modify getSelectedModelMeshes to return mesh info with selection state
  const getSelectedModelMeshes = () => {
    if (!selectedModel3D) return [];
    const meshes = [];
    selectedModel3D.traverse((child) => {
      if (child.isMesh) {
        const meshName = child.material.name || 'Unnamed Mesh';
        // Only add meshes that don't have 'not' in their name and aren't already in the list
        if (!meshName.includes('not') && !meshes.some(m => m.name === meshName)) {
          meshes.push({
            name: meshName,
            material: child.material,
            selected: selectedMeshes.includes(meshName)
          });
        }
      }
    });
    return meshes;
  };

  // Add handler for mesh selection
  const handleMeshSelect = (meshName) => {
    setSelectedMeshes(prev => {
      if (prev.includes(meshName)) {
        return prev.filter(name => name !== meshName);
      } else {
        return [...prev, meshName];
      }
    });
  };

  // Modify handleTextureSelect to apply texture only to selected meshes
  const handleTextureSelect = (texture) => {
    if (selectedWall && selectedWallRef.current) {
      const wallMesh = selectedWallRef.current;
      var textureUrl = texture.texture_url || texture.image;
      if (textureUrl && textureUrl.startsWith("http")) {
        textureUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(
          textureUrl
        )}`;
      }
      if (textureUrl) {
        const loader = new THREE.TextureLoader();
        loader.load(
          textureUrl,
          (tex) => {
            if (Array.isArray(wallMesh.material)) {
              wallMesh.material.forEach(mat => {
                // Set texture repeat based on mesh and texture dimensions
                if (wallMesh.geometry && wallMesh.geometry.parameters) {
                  const { width: wallWidth, height: wallHeight } = wallMesh.geometry.parameters;
                  let texWidth = tex.image ? tex.image.width : 1;
                  let texHeight = tex.image ? tex.image.height : 1;
                  if (!texWidth || !texHeight) {
                    texWidth = 10;
                    texHeight = 10;
                  }
                  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
                  tex.repeat.set(
                    Math.max(1, wallWidth / texWidth),
                    Math.max(1, wallHeight / texHeight)
                  );
                }
                mat.map = tex;
                mat.needsUpdate = true;
              });
            } else {
              // Set texture repeat based on mesh and texture dimensions
              if (wallMesh.geometry && wallMesh.geometry.parameters) {
                const { width: wallWidth, height: wallHeight } = wallMesh.geometry.parameters;
                let texWidth = tex.image ? tex.image.width : 1;
                let texHeight = tex.image ? tex.image.height : 1;
                if (!texWidth || !texHeight) {
                  texWidth = 10;
                  texHeight = 10;
                }
                tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
                tex.repeat.set(
                  Math.max(1, wallWidth / texWidth),
                  Math.max(1, wallHeight / texHeight)
                );
              }
              wallMesh.material.map = tex;
              wallMesh.material.needsUpdate = true;
            }
            // wallMesh.userData.textureUrl = textureUrl;
          },
          undefined,
          (err) => {
            console.error('Error loading wall texture:', err);
          }
        );
      }
    }
    
    // Apply texture to selected floor
    if (selectedFloor) {
      var textureUrl = texture.texture_url || texture.image;
      if (textureUrl && textureUrl.startsWith("http")) {
        textureUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(textureUrl)}`;
      }
      if (textureUrl) {
        const loader = new THREE.TextureLoader();
        loader.load(
          textureUrl,
          (tex) => {
            console.log(tex);
            console.log(selectedFloor.geometry);
            // Set texture repeat based on mesh and texture dimensions
            if (selectedFloor.geometry) {
              if (!selectedFloor.geometry.boundingBox) selectedFloor.geometry.computeBoundingBox();
              const box = selectedFloor.geometry.boundingBox;
              const floorWidth = box.max.x - box.min.x;
              const floorHeight = box.max.y - box.min.y;
              let texWidth = tex.image ? tex.image.width : 1;
              let texHeight = tex.image ? tex.image.height : 1;
              if (!texWidth || !texHeight) {
                texWidth = 10; 
                texHeight = 10;
              }
              tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
              // Use a fixed scale for repeat (e.g., 100 units per repeat)
              const repeatScale = 100; // Adjust as needed for your scene
              const repeatX = Math.max(1, floorWidth / repeatScale);
              const repeatY = Math.max(1, floorHeight / repeatScale);
              tex.repeat.set(repeatX, repeatY);
            }
            console.log(selectedFloor.material);
            console.log(tex);
            // selectedFloor.material.color = null;
            selectedFloor.material.map = tex;
            selectedFloor.material.needsUpdate = true;
          },
          undefined,
          (err) => {
            console.error('Error loading floor texture:', err);
          }
        );
      }
    }
    // If a 3D model is selected, apply the texture only to selected meshes
    if (selectedModel3D) {
      var textureUrl = texture.texture_url || texture.image;
      console.log(selectedMeshes);
      if (textureUrl && textureUrl.startsWith("http")) {
        textureUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(
          textureUrl
        )}`;
      }
      if (textureUrl) {
        const loader = new THREE.TextureLoader();
        loader.load(
          textureUrl,
          (tex) => {
            selectedModel3D.traverse((child) => {
              if (child.isMesh) {
                const meshName = child.material.name || ' ';
                if(selectedMeshes.length>0 ){
                  if (selectedMeshes.includes(meshName)) {
                    child.material.color=null;
                    child.material.map = tex;
                    child.material.needsUpdate = true;
                  }
                }else{
                  // child.material.color=null;
                  // child.material.map = tex;
                  // child.material.needsUpdate = true;
                }
              
              }
            });
          },
          undefined,
          (err) => {
            console.error('Error loading model texture:', err);
          }
        );
      }
    }
  };

  useEffect(() => {
    if (selectedModel3D) {
      console.log('selectedModel3D changed:', selectedModel3D);
      // You can put any logic here that should run when a model is selected
    }
  }, [selectedModel3D]);

  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.enabled = !isDragging;
    }
  }, [isDragging]);

  // Add this useEffect for model highlight
  useEffect(() => {
    // Remove previous model selection box if any
    if (modelSelectionBox.current && sceneRef.current) {
      sceneRef.current.remove(modelSelectionBox.current);
      modelSelectionBox.current.geometry.dispose();
      modelSelectionBox.current.material.dispose();
      modelSelectionBox.current = null;
    }
    if (selectedModel3D && sceneRef.current) {
      // Compute bounding box for the selected model
      const box = new THREE.Box3().setFromObject(selectedModel3D);
      const size = new THREE.Vector3();
      box.getSize(size);
      const center = new THREE.Vector3();
      box.getCenter(center);
      // Create a wireframe box
      const boxGeometry = new THREE.BoxGeometry(size.x, size.y, size.z);
      const boxMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 });
      const wireBox = new THREE.LineSegments(
        new THREE.EdgesGeometry(boxGeometry),
        boxMaterial
      );
      wireBox.position.copy(center);
      sceneRef.current.add(wireBox);
      modelSelectionBox.current = wireBox;
    }
  }, [selectedModel3D]);

  // Add this useEffect for logging state changes
  useEffect(() => {
    console.log('selectedModel3D:', selectedModel3D);
    console.log('dragStartPoint:', dragStartPoint);
    console.log('initialModelsPositionState:', initialModelsPositionState);
    console.log('isDragging:', isDragging);
  }, [selectedModel3D, dragStartPoint, initialModelsPositionState, isDragging]);

  // Handler to update model info from ModelInfoPanel
  const handleModelInfoChange = (updatedModel) => {
    console.log(updatedModel);
    
    if (selectedModel3D) {
      console.log(selectedModel3D);
      
      // Update userData
      selectedModel3D.userData = { ...selectedModel3D.userData, ...updatedModel };
  
      // Extract dimensions and scale
      const { width, height, depth, scale } = updatedModel;
      
      // Get bounding box size of the object
      const box = new THREE.Box3().setFromObject(selectedModel3D);
      const boxSize = new THREE.Vector3();
      box.getSize(boxSize);
  
      // Helper to avoid zero or negative scale values
      const safe = (value) => Math.max(0.001, value);
  
      // Recalculate scale based on new dimensions
      if (boxSize && width && height && depth) {
        const newScale = [
          safe(width) / safe(boxSize.x),
          safe(height) / safe(boxSize.y),
          safe(depth) / safe(boxSize.z),
        ];
        selectedModel3D.scale.set(...newScale);
      } else if (scale && Array.isArray(scale)) {
        const safeScale = scale.map(safe);
        selectedModel3D.scale.set(...safeScale);
      }
      console.log(selectedModel3D);
      // Optional: Force re-render if you're using React state
      // setSelectedModel3D({ ...selectedModel3D });
    }
  };
  

  // Handler to update wall info from WallInfoPanel
  const handleWallInfoChange = (updatedWall) => {
    setSelectedWall(updatedWall);
    // Update the wall mesh in the scene
    if (selectedWallRef.current) {
      selectedWallRef.current.userData.wallData = { ...updatedWall };
      const mesh = selectedWallRef.current;
      const { width } = mesh.geometry.parameters;
      const newGeometry = new THREE.BoxGeometry(
        width,
        updatedWall.height,
        updatedWall.thichknes
      );
      mesh.geometry.dispose();
      mesh.geometry = newGeometry;
      mesh.position.y = updatedWall.height / 2;
    }
    // Update the wall in the lines array so changes persist
    if (typeof onLinesChange === 'function' && Array.isArray(lines)) {
      const updatedLines = lines.map(wall =>
        wall.id === updatedWall.id ? { ...wall, ...updatedWall } : wall
      );
      onLinesChange(updatedLines);
    }
  };

  // Expose function through ref
  React.useImperativeHandle(ref, () => ({
    checkSelectedModel3D: () => {
      return selectedModel3D !== null;
    },
    getSelectedModelMeshes: getSelectedModelMeshes,
    get3DScreenshot: () => {
      if (rendererRef.current) {
        return rendererRef.current.domElement.toDataURL('image/png');
      }
      return '';
    },
    forceRenderAndScreenshot: () => {
      if (sceneRef.current && cameraRef.current && rendererRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
        return rendererRef.current.domElement.toDataURL('image/png');
      }
      return '';
    }
  }));

  // Right-click handler for models
  const handleCanvasContextMenu = (event) => {
    event.preventDefault();
    const renderer = containerRef.current && containerRef.current.firstChild && containerRef.current.firstChild.tagName === 'CANVAS' ? containerRef.current.firstChild : null;
    const camera = cameraRef.current;
    if (!renderer || !camera) return;

    // Calculate mouse position in normalized device coordinates
    const rect = renderer.getBoundingClientRect();
    const mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.current.setFromCamera({ x: mouseX, y: mouseY }, camera);
    const intersects = raycaster.current.intersectObjects(modelMeshes.current, true);

    if (intersects.length > 0) {
      // Find the top-level model object
      let modelObj = intersects[0].object;
      while (modelObj.parent && !modelMeshes.current.includes(modelObj)) {
        modelObj = modelObj.parent;
      }
      setDeleteModelIcon({
        visible: true,
        x: event.clientX + 10,
        y: event.clientY - 30,
        model: modelObj,
      });
    } else {
      setDeleteModelIcon({ ...deleteModelIcon, visible: false });
    }
  };

  // Delete handler for models
  const handleDeleteModel = () => {
    if (deleteModelIcon.model) {
      // Remove from scene
      sceneRef.current.remove(deleteModelIcon.model);
      // Remove from modelMeshes
      modelMeshes.current = modelMeshes.current.filter(obj => obj !== deleteModelIcon.model);
      setDeleteModelIcon({ ...deleteModelIcon, visible: false });
      setSelectedModel3D(null); // Deselect if needed
    }
  };

  // Hide icon on click elsewhere
  useEffect(() => {
    const handleClick = () => {
      if (deleteModelIcon.visible) setDeleteModelIcon({ ...deleteModelIcon, visible: false });
    };
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [deleteModelIcon.visible]);

  return (
    <div className="maindivcanvas3d">
      {/* AssetSelector */}
      {showModels && !isLoading && (
        <AssetSelector
          categories={modelCategories}
          onClose={() => setShowModels(false)}
          onSelect={handleModelSelect}
          title="Select Model"
          type="model"
        />
      )}
      {/* TextureSelector */}
      {showTextures && !isLoading && (
        <TextureSelector
          categories={textureCategories}
          onClose={() => setShowTextures(false)}
          onSelect={handleTextureSelect}
          title="Select Texture"
          type="texture"
          selectedMeshes={getSelectedModelMeshes()}
          onMeshSelect={handleMeshSelect}
        />
      )}
      <WallInfoPanel selectedWall={selectedWall} is3D={true} onChange={handleWallInfoChange} />
      {selectedModel3D && (
        <>
          <ModelInfoPanel
            selectedModel={selectedModel3D.userData}
            onChange={handleModelInfoChange}
            isEditable={false}
          />
        </>
      )}
      <button className="bottoncanvas3d" onClick={resetView}>
        Reset View
      </button>
      <button className="bottoncanvas3d_roof" onClick={toggleRoomRoofs}>
        {roofsVisible ? 'Remove Roof' : 'Add Roof'}
      </button>
      <div
        ref={containerRef}
        style={{ width: "100%", height: "100vh" }}
        onContextMenu={handleCanvasContextMenu}
      />
      {deleteModelIcon.visible && (
        <button
          style={{
            position: 'fixed',
            left: deleteModelIcon.x,
            top: deleteModelIcon.y,
            background: 'white',
            border: '1px solid red',
            borderRadius: '50%',
            padding: '4px',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
          }}
          onClick={e => { e.stopPropagation(); handleDeleteModel(); }}
          onContextMenu={e => e.preventDefault()}
          title="Delete model"
        >
          🗑️
        </button>
      )}
 
    </div>
  );
});

export default GridCanvas3D;
