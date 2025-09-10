import React from 'react';

/**
 * LoadedItems component
 * @param {Object[]} items - Array of loaded items (models/textures)
 * Each item should have at least: id, name, image, gltfUrl (or model_url), and any other metadata.
 */
const LoadedItems = ({ items = [] }) => {
  return (
    <div style={{ padding: 12, background: '#f9f9f9', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', maxWidth: 350 }}>
      <h4 style={{ marginBottom: 10 }}>Loaded Items</h4>
      {items.length === 0 ? (
        <div style={{ color: '#888' }}>No items loaded.</div>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {items.map(item => (
            <li key={item.id || item.name} style={{ display: 'flex', alignItems: 'center', marginBottom: 10, background: '#fff', borderRadius: 6, padding: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <img src={item.image || item.image2d_url} alt={item.name} style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4, marginRight: 10, border: '1px solid #eee' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500 }}>{item.name}</div>
                <div style={{ fontSize: 12, color: '#666', wordBreak: 'break-all' }}>
                  GLTF: {item.gltfUrl || item.model_url || 'N/A'}
                </div>
              </div>
              {/* Future: Add remove/edit/reload buttons here */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LoadedItems; 