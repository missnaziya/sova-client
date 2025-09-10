import * as THREE from 'three';

export function createCamera(width, height, center = new THREE.Vector3(0, 0, 0)) {
  const camera = new THREE.PerspectiveCamera(
    45,
    width / height,
    0.1,
    20000
  );
  camera.position.set(200, 200, 200);
  camera.lookAt(center);
  return camera;
} 