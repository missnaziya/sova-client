import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export function createControls(camera, domElement, center) {
  const controls = new OrbitControls(camera, domElement);
  controls.enableDamping = false;
  controls.dampingFactor = 0.002;
  controls.screenSpacePanning = false;
  controls.minDistance = 1;
  controls.maxDistance = 10000;
  controls.enableRotate = true;
  controls.enablePan = true;
  controls.maxPolarAngle = Math.PI / 2.1;
  controls.minPolarAngle = 0;
  controls.zoomSpeed = 0.8;
  controls.rotateSpeed = 0.9;
  controls.panSpeed = 0.9;
  if (center) controls.target.copy(center);
  controls.update();
  return controls;
} 