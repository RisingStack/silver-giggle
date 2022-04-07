import "./style.css";
import * as THREE from "three";

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

const length = 6.4;
/**
 * Objects
 */
const logo = new THREE.Group();

// const center = new THREE.Mesh(
//   new THREE.BoxGeometry(1, 1, 1),
//   new THREE.MeshBasicMaterial({ color: "red" })
// );
// pair.add(center);

const createPair = (yRotation = 0, color = "#abc655") => {
  const pair = new THREE.Group();
  const side1 = new THREE.Mesh(
    new THREE.BoxGeometry(length, 1, 1),
    new THREE.MeshBasicMaterial({ color })
  );
  side1.position.z = 5;
  pair.add(side1);

  const side2 = new THREE.Mesh(
    new THREE.BoxGeometry(length, 1, 1),
    new THREE.MeshBasicMaterial({ color })
  );
  side2.position.z = -5;
  pair.add(side2);
  pair.rotation.y = yRotation;
  return pair;
};

const createHexagon = (yPosition = 0) => {
  const hexagon = new THREE.Group();
  hexagon.add(createPair());
  hexagon.add(createPair(Math.PI / 3));
  hexagon.add(createPair((2 * Math.PI) / 3));
  hexagon.position.y = yPosition;
  return hexagon;
};

logo.add(createHexagon());
logo.add(createHexagon(2));

scene.add(logo);

const axesHelper = new THREE.AxesHelper(1);
scene.add(axesHelper);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);

let cameraYPosition = 10;
camera.position.set(1, cameraYPosition, 4);
camera.lookAt(logo.position);
scene.add(camera);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);

document.addEventListener("wheel", (ev) => {
  if (ev.deltaY > 0) {
    cameraYPosition += 0.5;
  } else {
    cameraYPosition -= 0.5;
  }
});

const clock = new THREE.Clock();
const tick = () => {
  camera.position.set(1, cameraYPosition, 1);
  const elapsedTime = clock.getElapsedTime();
  logo.rotation.y = elapsedTime * 1;
  logo.rotation.x = elapsedTime * 1;

  requestAnimationFrame(tick);
  renderer.render(scene, camera);
};

tick();
