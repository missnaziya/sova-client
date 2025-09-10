import * as THREE from 'three';

export function addFloorToScene(scene, points2D) {
  if (!points2D || points2D.length < 3) return null;
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
  return floor;
} 