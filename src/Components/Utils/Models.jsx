import { useEffect, useState } from 'react';
import { fetchAllModels } from '../../apis/authApis/modelsApi';
import { Canvas } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';

function SceneModel({ model, onClick }) {
  // If model has a GLTF url, load it
  if (model.gltfUrl || model.url) {
    const { scene } = useGLTF(model.gltfUrl || model.url);
    return (
      <primitive
        object={scene}
        position={model.position || [0, 0, 0]}
        scale={model.scale || [1, 1, 1]}
        onClick={onClick}
      />
    );
  }
  // Fallback: render a box if no url
  return (
    <mesh position={model.position || [0, 0, 0]} scale={model.scale || [1, 1, 1]} onClick={onClick}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={model.color || 'orange'} />
    </mesh>
  );
}

const Models = () => {
  const [modelList, setModelList] = useState([]); // All models from API
  const [loadedModels, setLoadedModels] = useState([]); // Models loaded in scene
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllModels().then(data => {
      // Flatten all models from all categories into a single array, keeping all properties
      let allModels = [];
      if (Array.isArray(data)) {
        // If API returns a flat array
        allModels = data;
      } else if (data && Array.isArray(data.categories)) {
        // If API returns categories
        data.categories.forEach(cat => {
          if (Array.isArray(cat.models)) {
            allModels.push(...cat.models.map(m => ({ ...m, category: cat.name })));
          }
        });
      }
      setModelList(allModels);
      setLoading(false);
    });
  }, []);

  const handleModelClick = (model) => {
    // Add model to loadedModels with all its properties, and default position/scale if not present
    setLoadedModels(models => [
      ...models,
      {
        ...model,
        position: model.position || [0, 0, 0],
        scale: model.scale || [1, 1, 1],
        // Add more defaults if needed
      }
    ]);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Available Models</h2>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 24 }}>
        {modelList.map(model => (
          <div
            key={model._id || model.id}
            style={{ border: '1px solid #ccc', padding: 8, width: 120, textAlign: 'center', cursor: 'pointer' }}
            onClick={() => handleModelClick(model)}
          >
            <img src={model.image} alt={model.name} style={{ width: 60, height: 60, objectFit: 'contain' }} />
            <div>{model.name}</div>
            <div style={{ fontSize: 10 }}>{model.type}</div>
          </div>
        ))}
      </div>
      <Canvas camera={{ position: [0, 0, 5] }} style={{ height: 400, background: '#f0f0f0' }}>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        {loadedModels.map((model, idx) => (
          <SceneModel key={model._id || model.id || idx} model={model} />
        ))}
      </Canvas>
    </div>
  );
};

export default Models; 