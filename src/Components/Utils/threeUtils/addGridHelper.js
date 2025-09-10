import * as THREE from 'three';

export function addGridHelper(scene) {
  const gridSize = 20000;
  const divisions = 1000;
  const gridHelper = new THREE.GridHelper(
    gridSize,
    divisions,
    0x888888,
    0x444444
  );
  scene.add(gridHelper);
} 