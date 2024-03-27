import { useGLTF } from "@react-three/drei";
import React from "react";
import { Mesh, BufferGeometry } from "three";
import { Geometry } from "three-stdlib";

function toConvexProps(bufferGeometry: BufferGeometry) {
    const geo = new Geometry().fromBufferGeometry(bufferGeometry);
    // Merge duplicate vertices resulting from glTF export.
    // Cannon assumes contiguous, closed meshes to work
    geo.mergeVertices();
    return [geo.vertices.map((v) => [v.x, v.y, v.z]), geo.faces.map((f) => [f.a, f.b, f.c]), []]; // prettier-ignore
}

export const MotocycleModel = ({
    position,
    rotation,
}: {
    position?: [number, number, number];
    rotation?: [number, number, number];
}) => {
    const gltf = useGLTF("/models/motorcycle.glb");
    gltf.scene.castShadow = true;
    gltf.scene.traverse((object) => {
        if (object instanceof Mesh) {
            object.castShadow = true;
        }
    });

    console.log('motocycle gltf:', gltf)

    return (
        <group castShadow position={position}>
            <primitive object={gltf.scene} scale={[0.005, 0.005, 0.005]} position={[0, 0, 0.05]} rotation={[Math.PI / 2, 0, 0]}/>
        </group>
    );
};

useGLTF.preload("/models/motorcycle.glb");