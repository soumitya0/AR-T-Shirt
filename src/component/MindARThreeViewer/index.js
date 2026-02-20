import { MindARThree } from "mind-ar/dist/mindar-image-three.prod.js";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import tshirt from "../../assets/tshirt/targets.mind";

const MindARThreeViewer = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const mindarThree = new MindARThree({
      container: containerRef.current,
      imageTargetSrc: tshirt,
    });

    const { renderer, scene, camera } = mindarThree;

    const geometry = new THREE.PlaneGeometry(1, 1);

    const material = new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0.5,
    });

    const plane = new THREE.Mesh(geometry, material);
    const anchor = mindarThree.addAnchor(0);
    anchor.group.add(plane); //to group the scene

    mindarThree.start();

    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });
  }, []);

  return (
    <div
      style={{ width: "100vw", height: "100vh", border: "1px solid red" }}
      ref={containerRef}
    ></div>
  );
};

export default MindARThreeViewer;
