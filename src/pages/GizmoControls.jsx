import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { TransformControls } from "three/examples/jsm/controls/TransformControls.js";
 
const GizmoControls = ({ scene, models, setSelectedModel, renderer }) => {
  const transformRef = useRef(null);
 
  useEffect(() => {
    if (!scene || !renderer) return;
 
    const camera = scene.children.find((obj) => obj.isCamera);
    if (!camera) return;
 
    const transformControl = new TransformControls(camera, renderer.domElement);
    scene.add(transformControl);
    transformRef.current = transformControl;
 
    const handleModelClick = (event) => {
      const mouse = new THREE.Vector2();
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
 
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);
 
      const intersects = raycaster.intersectObjects(models, true);
      if (intersects.length > 0) {
        const clickedModel = intersects[0].object.parent;
        setSelectedModel(clickedModel);
        transformControl.attach(clickedModel);
      }
    };
 
    renderer.domElement.addEventListener("click", handleModelClick);
 
    return () => {
      renderer.domElement.removeEventListener("click", handleModelClick);
      transformControl.dispose();
    };
  }, [scene, models, renderer]);
 
  return null;
};
 
export default GizmoControls;