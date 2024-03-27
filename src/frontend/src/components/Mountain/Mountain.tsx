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

export const MountainModel = ({
    position,
    rotation,
}: {
    position?: [number, number, number];
    rotation?: [number, number, number];
}) => {
    const gltf = useGLTF("/models/mountain_track.glb");
    gltf.scene.castShadow = true;
    gltf.scene.traverse((object) => {
        if (object instanceof Mesh) {
            object.castShadow = true;
        }
    });

    console.log('mountain gltf:', gltf)

    return (
        <group castShadow position={position} rotation={rotation}>
            <primitive object={gltf.scene} position={[0, 0, 0]} scale={[0.001, 0.001, 0.001]} />
        </group>
    );
};

useGLTF.preload("/models/mountain_track.glb");