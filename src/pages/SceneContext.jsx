import { createContext, useContext } from "react";

const SceneContext = createContext();

export const useSceneContext = () => useContext(SceneContext);

export const SceneContextProvider = ({ children }) => {
  const wallVertices = []; 

  return (
    <SceneContext.Provider value={{ wallVertices }}>
      {children}
    </SceneContext.Provider>
  );
};
