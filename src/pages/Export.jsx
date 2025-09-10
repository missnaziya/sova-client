// import React, { useRef, useState, useEffect } from 'react';
// import { Canvas } from '@react-three/fiber';
// import { useFrame } from '@react-three/fiber';
// import { OrbitControls } from '@react-three/drei';

// function Wall({ points }) {
//   const mesh = useRef();

//   useFrame(() => {
//     if (mesh.current && points.length > 1) {
//       const geometry = new THREE.BufferGeometry();
//       geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
//       geometry.computeVertexNormals(); 
//       mesh.current.geometry.dispose(); 
//       mesh.current.geometry = geometry; 
//     }
//   });

//   return (
//     <mesh ref={mesh}>
//       <extrudeGeometry args={[
//         { points: points, bevelEnabled: false }, 
//         { depth: 1, bevelSegments: 0 } 
//       ]} /> 
      
//       <meshStandardMaterial color="gray" />
//     </mesh>
//   );
// }

// function Export() {
//   const [points, setPoints] = useState([]);

//   const handleMouseMove = (event) => {
//     const canvas = event.currentTarget;
//     const rect = canvas.getBoundingClientRect();
//     const mouseX = event.clientX - rect.left;
//     const mouseY = event.clientY - rect.top;

//     const normalizedX = (mouseX / canvas.width) * 2 - 1;
//     const normalizedY = -(mouseY / canvas.height) * 2 + 1;

//     setPoints([...points, [normalizedX, normalizedY, 0]]);
//   };

//   return (
//     <>
//       <Canvas camera={{ position: [0, 0, 5] }}>
//         <ambientLight intensity={0.5} />
//         <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
//         <pointLight position={[-10, -10, -10]} />
//         <Wall points={points} />
//         <OrbitControls />
//       </Canvas>

//       <canvas 
//         width={500} 
//         height={300} 
//         onMouseMove={handleMouseMove} 
//         style={{ border: '1px solid black' }} 
//       />
//     </>
//   );
// }

// export default Export;

import React from 'react'

const Export = () => {
  return (
    <div>
      fcgvhbjkl
    </div>
  )
}

export default Export
