// threeModelUtils.js
import * as THREE from 'three';

/**
 * Adds a model to the scene and the appropriate mesh array.
 * @param {THREE.Scene} scene - The Three.js scene.
 * @param {Object} model - The model info object (should have a 'type' property).
 * @param {THREE.Object3D} obj - The loaded GLTF scene/object.
 * @param {Array} wallMeshes - Array to store wall meshes.
 * @param {Array} modelMeshes - Array to store regular model meshes.
 */
export function addModelToScene(scene, model, obj, wallMeshes, modelMeshes) {
  if (scene) {
    scene.add(obj);
  }
  if (model.type === 'wall') {
    wallMeshes.push(obj);
  } else {
    modelMeshes.push(obj);
  }
}

/**
 * Moves a model, restricting wall models to wall axis (using the provided wall object).
 * Allows vertical movement via yOffset.
 * @param {THREE.Object3D} selectedModel - The model to move.
 * @param {THREE.Vector3} initialPosition - The initial position before drag.
 * @param {THREE.Vector3} delta - The movement delta vector.
 * @param {Object} wall - The wall object (with start, end, height).
 * @param {number} [yOffset] - Optional y position for the model (for vertical movement).
 */
export function moveModel(selectedModel, initialPosition, delta, wall, yOffset) {
  if (selectedModel && selectedModel.userData && selectedModel.userData.type === 'wall' && wall) {
    const start = new THREE.Vector3(wall.start.x, 0, wall.start.y);
    const end = new THREE.Vector3(wall.end.x, 0, wall.end.y);
    const wallDir = end.clone().sub(start).normalize();
    const deltaVec = initialPosition.clone().add(delta).sub(start);
    const projectedLength = deltaVec.dot(wallDir);
    const projectedPoint = start.clone().add(wallDir.clone().multiplyScalar(projectedLength));
    const wallHeight = wall.height || 118;
    // Use yOffset if provided, else default to wall center
    const yPos = typeof yOffset === 'number' ? yOffset : wallHeight / 2;
    selectedModel.position.set(projectedPoint.x, yPos, projectedPoint.z);
    // Update rotation to match wall
    const angle = -Math.atan2(end.z - start.z, end.x - start.x);
    selectedModel.rotation.y = angle;
  } else if (selectedModel) {
    selectedModel.position.copy(initialPosition.clone().add(delta));
  }
} 