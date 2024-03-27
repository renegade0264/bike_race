import { Canvas } from "@react-three/fiber";
import { Experience } from "./components/Experience";
import { Suspense } from "react";
import { Physics } from '@react-three/rapier';

function App() {
  return (
    <Canvas shadows camera={{ position: [3, 3, 3], fov: 30 }}>
      <Suspense>
        <Physics>
          <color attach="background" args={["#ececec"]} />
          <Experience />
        </Physics>
      </Suspense>
    </Canvas>
  );
}

export default App;
