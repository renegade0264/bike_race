import { CameraControls, OrbitControls } from "@react-three/drei";
import React, { useRef } from "react";
import { MountainModel } from "./Mountain/Mountain";
import { MotocycleModel } from "./Motocycle/Motocycle";
import { RigidBody } from '@react-three/rapier';


export const Experience = () => {
  const cameraControlRef = useRef < CameraControls | null > (null)

  return (
    <>
      <RigidBody colliders={"trimesh"} type="fixed">
        <MountainModel position={[0, 0, 0]} />
      </RigidBody>
      <CameraControls
        ref={cameraControlRef.current}
        position={[0, 8, 0]}
        setLookAt={[0, 8, 0]}
        maxPolarAngle={Math.PI / 2 + Math.PI / 8}
      />
      <RigidBody colliders={"cuboid"} type="fixed" position={[2.0, 7, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
        {/* <axesHelper args={[10, 10, 10]} position={[0, 0, 0.2]} /> */}
        <MotocycleModel />
      </RigidBody>
      <RigidBody colliders={"cuboid"} type="fixed" position={[2.15, 7, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
        {/* <axesHelper args={[10, 10, 10]} position={[0, 0, 0.2]} /> */}
        <MotocycleModel />
      </RigidBody>
      <directionalLight
        position={[1000, 1000, 1000]}
        castShadow
        intensity={0.5}
      />
      <directionalLight
        position={[1000, 1000, -1000]}
        castShadow
        intensity={0.5}
      />
      <directionalLight
        position={[-1000, 1000, 1000]}
        castShadow
        intensity={0.5}
      />
      <directionalLight
        position={[-1000, 1000, -1000]}
        castShadow
        intensity={0.5}
      />
    </>
  );
};
