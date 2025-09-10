import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

const RenderScene = ({ wallVertices, droppedModels }) => {
  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <h1 style={{ textAlign: "center" }}>Rendered Scene</h1>
      <Canvas>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        {wallVertices.map(({ start, end }, index) => {
          const length = new THREE.Vector3(...start).distanceTo(
            new THREE.Vector3(...end)
          );
          const midPoint = new THREE.Vector3(
            (start[0] + end[0]) / 2,
            1.5,
            (start[2] + end[2]) / 2
          );
          const angle = Math.atan2(end[2] - start[2], end[0] - start[0]);
          return (
            <mesh key={index} position={midPoint} rotation={[0, -angle, 0]}>
              <boxGeometry args={[length, 3, 0.4]} />
              <meshStandardMaterial color="gray" />
            </mesh>
          );
        })}
        {droppedModels.map(({ model, position }, index) => (
          <primitive key={index} object={model} position={position} />
        ))}
        <OrbitControls />
      </Canvas>
    </div>
  );
};

export default RenderScene;
