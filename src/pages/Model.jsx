// import React, { useEffect, useRef, useState } from "react";
// import * as THREE from "three";
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
// import { TransformControls } from "three/examples/jsm/controls/TransformControls.js";
// import { GUI } from "dat.gui";
// import { SkeletonHelper } from "three";

// const Model = () => {
//   const mountRef = useRef(null);
//   const [models, setModels] = useState([]); 
//   const [scene, setScene] = useState(null);
//   const [transformControls, setTransformControls] = useState(null);
//   const [selectedModel, setSelectedModel] = useState(null); 
//   const guiRef = useRef(null);

//   const textureList = [
//     { name: "Texture 1", url: "/textures/1.jpg" },
//     { name: "Texture 2", url: "/textures/2.jpg" },
//     { name: "Texture 3", url: "/textures/3.jpg" },
//     { name: "Texture 4", url: "/textures/4.jpg" },
//     { name: "Texture 5", url: "/textures/5.jpg" },
//   ];

//   useEffect(() => {
//     const scene = new THREE.Scene();
//     const camera = new THREE.PerspectiveCamera(
//       75,
//       window.innerWidth / window.innerHeight,
//       0.1,
//       1000
//     );
//     const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
//     renderer.setSize(window.innerWidth, window.innerHeight);
//     mountRef.current.appendChild(renderer.domElement);

//     const controls = new OrbitControls(camera, renderer.domElement);
//     controls.enableDamping = true;

//     const ambientLight = new THREE.AmbientLight(0xffffff, 1);
//     scene.add(ambientLight);

//     camera.position.set(0, 2, 5);

//     const transformControl = new TransformControls(camera, renderer.domElement);
//     scene.add(transformControl);
//     setTransformControls(transformControl);

//     transformControl.addEventListener("dragging-changed", (event) => {
//       controls.enabled = !event.value; 
//     });

//     const animate = () => {
//       requestAnimationFrame(animate);
//       controls.update();
//       if (transformControl) transformControl.update(); 
//       renderer.render(scene, camera);
//     };
//     animate();

//     setScene(scene);

//     const handleDrop = (event) => {
//       event.preventDefault();
//       const files = event.dataTransfer.files;
//       if (files.length > 0) {
//         const fileUrls = Array.from(files).map((file) => URL.createObjectURL(file));
//         loadModels(fileUrls);
//       }
//     };

//     const handleDragOver = (event) => {
//       event.preventDefault();
//     };

//     // const loadModels = (urls) => {
//     //   const loader = new GLTFLoader();
//     //   const dracoLoader = new DRACOLoader();
//     //   dracoLoader.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");
//     //   loader.setDRACOLoader(dracoLoader);

//     //   Promise.all(
//     //     urls.map((url) =>
//     //       new Promise((resolve, reject) => {
//     //         loader.load(
//     //           url,
//     //           (gltf) => {
//     //             const newModel = gltf.scene;
//     //             if (newModel instanceof THREE.Object3D) {
//     //               resolve(newModel);
//     //             } else {
//     //               reject(new Error("Loaded object is not a valid THREE.Object3D"));
//     //             }
//     //           },
//     //           undefined,
//     //           (error) => reject(error)
//     //         );
//     //       })
//     //     )
//     //   )
//     //     .then((loadedModels) => {
//     //       setModels((prevModels) => {
//     //         const updatedModels = [...prevModels, ...loadedModels];
//     //         updatedModels.forEach((model) => {
//     //           scene.add(model);
//     //           const helper = new SkeletonHelper(model);
//     //           scene.add(helper);
//     //           setupGUI(model);
//     //         });
//     //         return updatedModels;
//     //       });
//     //     })
//     //     .catch((error) => {
//     //       console.error("Error loading one or more models:", error);
//     //     });
//     // };
//     const loadModels = (urls) => {
//       const loader = new GLTFLoader();
//       const dracoLoader = new DRACOLoader();
//       dracoLoader.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");
//       loader.setDRACOLoader(dracoLoader);
    
//       loader.register((parser) => {
//         return new THREE.GLTFLoader.KHRMaterialsPbrSpecularGlossinessExtension(parser);
//       });
    
//       Promise.all(
//         urls.map((url) =>
//           new Promise((resolve, reject) => {
//             loader.load(
//               url,
//               (gltf) => {
//                 const newModel = gltf.scene;
//                 if (newModel instanceof THREE.Object3D) {
//                   resolve(newModel);
//                 } else {
//                   reject(new Error("Loaded object is not a valid THREE.Object3D"));
//                 }
//               },
//               undefined,
//               (error) => reject(error)
//             );
//           })
//         )
//       )
//         .then((loadedModels) => {
//           setModels((prevModels) => {
//             const updatedModels = [...prevModels, ...loadedModels];
//             updatedModels.forEach((model) => {
//               scene.add(model);
//               const helper = new SkeletonHelper(model);
//               scene.add(helper);
//               setupGUI(model);
//             });
//             return updatedModels;
//           });
//         })
//         .catch((error) => {
//           console.error("Error loading one or more models:", error);
//         });
//     };
    
//     const mount = mountRef.current;
//     mount.addEventListener("drop", handleDrop);
//     mount.addEventListener("dragover", handleDragOver);

//     return () => {
//       mount.removeEventListener("drop", handleDrop);
//       mount.removeEventListener("dragover", handleDragOver);
//       renderer.dispose();
//       if (guiRef.current) {
//         guiRef.current.destroy();
//       }
//       if (transformControl) {
//         scene.remove(transformControl);
//         transformControl.dispose();
//       }
//     };
//   }, []);

//   useEffect(() => {
//     if (selectedModel && transformControls) {
//       transformControls.attach(selectedModel);
//     }
//   }, [selectedModel, transformControls]);

//   const applyTexture = (textureUrl) => {
//     if (!scene || !models.length) {
//       console.log("Scene or models not initialized yet.");
//       return;
//     }

//     const textureLoader = new THREE.TextureLoader();
//     textureLoader.load(
//       textureUrl,
//       (texture) => {
//         models.forEach((model) => {
//           model.traverse((child) => {
//             if (child.isMesh) {
//               child.material.map = texture;
//               child.material.needsUpdate = true;
//             }
//           });
//         });
//       },
//       undefined,
//       (error) => {
//         console.error("Error loading texture:", error);
//       }
//     );
//   };

//   const setupGUI = (model) => {
//     if (guiRef.current) {
//       guiRef.current.destroy();
//     }

//     const gui = new GUI();
//     guiRef.current = gui;

//     const modelPosition = model.position;
//     gui.add(modelPosition, "x", -5, 5, 0.1).name("Position X");
//     gui.add(modelPosition, "y", -5, 5, 0.1).name("Position Y");
//     gui.add(modelPosition, "z", -5, 5, 0.1).name("Position Z");

//     const scale = model.scale;
//     gui.add(scale, "x", 0.1, 5, 0.1).name("Scale X");
//     gui.add(scale, "y", 0.1, 5, 0.1).name("Scale Y");
//     gui.add(scale, "z", 0.1, 5, 0.1).name("Scale Z");
//   };

//   return (
//     <div>
//       <div
//         ref={mountRef}
//         style={{ width: "80vw", height: "80vh", border: "2px dashed #ccc" }}
//       >
//         <p>Drag and Drop .gltf or .glb models here</p>
//       </div>

//       {models.length > 0 && (
//         <div>
//           <h3>Select a model to transform:</h3>
//           {models.map((model, index) => (
//             <button key={index} onClick={() => setSelectedModel(model)}>
//               Select Model {index + 1}
//             </button>
//           ))}
//         </div>
//       )}

//       {textureList.map((texture) => (
//         <button key={texture.url} onClick={() => applyTexture(texture.url)}>
//           {texture.name}
//         </button>
//       ))}
//     </div>
//   );
// };

// export default Model;
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { TransformControls } from "three/examples/jsm/controls/TransformControls.js";
import { GUI } from "dat.gui";
import { SkeletonHelper } from "three";

const Model = () => {
  const mountRef = useRef(null);
  const [models, setModels] = useState([]);
  const [scene, setScene] = useState(null);
  const [transformControls, setTransformControls] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const guiRef = useRef(null);

  const textureList = [
    { name: "Texture 1", url: "/textures/1.jpg" },
    { name: "Texture 2", url: "/textures/2.jpg" },
    { name: "Texture 3", url: "/textures/3.jpg" },                                                    
    { name: "Texture 4", url: "/textures/4.jpg" },
    { name: "Texture 5", url: "/textures/5.jpg" },
  ];

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    camera.position.set(0, 2, 5);

    const transformControl = new TransformControls(camera, renderer.domElement);
    scene.add(transformControl);
    setTransformControls(transformControl);

    transformControl.addEventListener("dragging-changed", (event) => {
      controls.enabled = !event.value;
    });

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      if (transformControl) transformControl.update();
      renderer.render(scene, camera);
    };
    animate();

    setScene(scene);

    const handleDrop = (event) => {
      event.preventDefault();
      const files = event.dataTransfer.files;
      if (files.length > 0) {
        Array.from(files).forEach((file) => {
          const url = URL.createObjectURL(file);
          loadModel(url);
        });
      }
    };

    const handleDragOver = (event) => {
      event.preventDefault();
    };

    const loadModel = (url) => {
      const loader = new GLTFLoader();
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");
      loader.setDRACOLoader(dracoLoader);

      loader.load(
        url,
        (gltf) => {
          const newModel = gltf.scene;
          if (newModel instanceof THREE.Object3D) {
            setModels((prevModels) => [...prevModels, newModel]);
            scene.add(newModel);

            const helper = new SkeletonHelper(newModel);
            scene.add(helper);

            setupGUI(newModel);
          } else {
            console.error("Loaded object is not a valid THREE.Object3D");
          }
        },
        undefined,
        (error) => console.error("Error loading the model:", error)
      );
    };

    const mount = mountRef.current;
    mount.addEventListener("drop", handleDrop);
    mount.addEventListener("dragover", handleDragOver);

    return () => {
      mount.removeEventListener("drop", handleDrop);
      mount.removeEventListener("dragover", handleDragOver);
      renderer.dispose();
      if (guiRef.current) {
        guiRef.current.destroy();
      }
      if (transformControl) {
        scene.remove(transformControl);
        transformControl.dispose();
      }
    };
  }, [models]);

  useEffect(() => {
    if (selectedModel && transformControls) {
      transformControls.attach(selectedModel);
    }
  }, [selectedModel, transformControls]);

  const applyTexture = (textureUrl) => {
    if (!scene || !models.length) {
      console.log("Scene or models not initialized yet.");
      return;
    }

    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      textureUrl,
      (texture) => {
        models.forEach((model) => {
          model.traverse((child) => {
            if (child.isMesh) {
              child.material.map = texture;
              child.material.needsUpdate = true;
            }
          });
        });
      },
      undefined,
      (error) => {
        console.error("Error loading texture:", error);
      }
    );
  };

  const setupGUI = (model) => {
    if (guiRef.current) {
      guiRef.current.destroy();
    }

    const gui = new GUI();
    guiRef.current = gui;

    const modelPosition = model.position;
    gui.add(modelPosition, "x", -5, 5, 0.1).name("Position X");
    gui.add(modelPosition, "y", -5, 5, 0.1).name("Position Y");
    gui.add(modelPosition, "z", -5, 5, 0.1).name("Position Z");

    const scale = model.scale;
    gui.add(scale, "x", 0.1, 5, 0.1).name("Scale X");
    gui.add(scale, "y", 0.1, 5, 0.1).name("Scale Y");
    gui.add(scale, "z", 0.1, 5, 0.1).name("Scale Z");
  };

  return (
    <div>
      <div
        ref={mountRef}
        style={{ width: "100%", height: "100%", border: "2px dashed #ccc" }}
      >
        <p>Drag and Drop .gltf or .glb models here</p>
      </div>

      {models.length > 0 && (
        <div>
          <h3>Select a model to transform:</h3>
          {models.map((model, index) => (
            <button key={index} onClick={() => setSelectedModel(model)}>
              Select Model {index + 1}
            </button>
          ))}
        </div>
      )}

      {textureList.map((texture) => (
        <button key={texture.url} onClick={() => applyTexture(texture.url)}>
          {texture.name}
        </button>
      ))}
    </div>
  );
};

export default Model;
