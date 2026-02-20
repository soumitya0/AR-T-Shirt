import { MindARThree } from "mind-ar/dist/mindar-image-three.prod.js";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import tshirt from "../../assets/tshirt/targets.mind";

// 3D model: file in public/models/ is served at /models/filename.glb
const MODEL_URL = "/models/male_full_body_ecorche.glb";

// Scale and position of the 3D model on the target (smaller = fits screen better)
const MODEL_SCALE = 0.04;
const MODEL_POSITION = { x: 0, y: 0, z: 0 };

const MindARThreeViewer = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const mindarThree = new MindARThree({
      container,
      imageTargetSrc: tshirt,
    });

    const { renderer, scene, camera } = mindarThree;
    const anchor = mindarThree.addAnchor(0);

    // Lights so the model isn't black (GLB materials need lighting)
    const ambient = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambient);
    const directional = new THREE.DirectionalLight(0xffffff, 1.2);
    directional.position.set(2, 3, 4);
    scene.add(directional);
    const hemisphere = new THREE.HemisphereLight(0xffffff, 0x888888, 0.6);
    scene.add(hemisphere);

    const loader = new GLTFLoader();
    loader.load(
      MODEL_URL,
      (gltf) => {
        const model = gltf.scene;
        model.scale.setScalar(MODEL_SCALE);
        model.position.set(
          MODEL_POSITION.x,
          MODEL_POSITION.y,
          MODEL_POSITION.z,
        );
        // Ensure materials are visible (some GLBs are authored dark; add a bit of emissive)
        model.traverse((child) => {
          if (child.isMesh && child.material) {
            const mat = child.material;
            if (mat.emissive) {
              mat.emissive.setHex(0x333333);
              mat.emissiveIntensity = 0.3;
            }
          }
        });
        anchor.group.add(model);
      },
      undefined,
      (err) => {
        console.error("Failed to load 3D model:", err);
        // Fallback: simple cube so AR still shows something
        const geometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
        const material = new THREE.MeshNormalMaterial();
        const cube = new THREE.Mesh(geometry, material);
        anchor.group.add(cube);
      },
    );

    mindarThree.start();

    const animate = () => {
      renderer.render(scene, camera);
    };
    renderer.setAnimationLoop(animate);

    return () => {
      renderer.setAnimationLoop(null);
      try {
        mindarThree.stop();
      } catch (_) {
        // stop() can throw if start() hasn't completed yet (e.g. React Strict Mode unmount)
      }
    };
  }, []);

  return (
    <div
      style={{ width: "100vw", height: "100vh", border: "1px solid red" }}
      ref={containerRef}
    />
  );
};

export default MindARThreeViewer;
