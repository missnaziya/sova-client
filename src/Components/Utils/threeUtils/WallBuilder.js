import * as THREE from 'three';

export function addWallToScene(scene, start, end, line, wallMeshes) {
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
    metalness: 0
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
  if (wallMeshes) wallMeshes.push(wall);
  return wall;
} 