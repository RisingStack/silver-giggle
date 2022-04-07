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

const createPair = (yRotation = 0, color) => {
  const pair = new THREE.Group();
  const width = 1;
  const side1 = new THREE.Mesh(
    new THREE.BoxGeometry(length, width, width),
    new THREE.MeshBasicMaterial({ color })
  );
  side1.position.z = 5;
  pair.add(side1);

  const side2 = side1.clone();
  side2.position.z = -5;
  pair.add(side2);

  pair.rotation.y = yRotation;
  return pair;
};

const createHexagon = (yPosition = 0, color) => {
  const hexagon = new THREE.Group();
  hexagon.add(createPair(0, color));
  hexagon.add(createPair(Math.PI / 3, color));
  hexagon.add(createPair((2 * Math.PI) / 3, color));
  hexagon.position.y = yPosition;
  return hexagon;
};

const distance = 4.3;
const hexagons = [
  createHexagon(-distance, "#2c6049"),
  createHexagon(0, "#6d944f"),
  createHexagon(distance, "#abc655"),
];
hexagons.forEach((hexagon) => {
  logo.add(hexagon);
});

scene.add(logo);

// const axesHelper = new THREE.AxesHelper(1);
// scene.add(axesHelper);

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

const listener = new THREE.AudioListener();
camera.add(listener);

// create a global audio source
const sound = new THREE.Audio(listener);

// load a sound and set it as the Audio object's buffer
const audioLoader = new THREE.AudioLoader();
audioLoader.load("music.mp3", function (buffer) {
  sound.setBuffer(buffer);
  sound.setLoop(true);
  sound.setVolume(0.5);
  sound.play();
});

const defaultZoom = 45;
let zoom = defaultZoom;
camera.position.set(0, zoom, 0);
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
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

document.addEventListener("wheel", (ev) => {
  if (ev.deltaY > 0) {
    zoom += 0.5;
  } else {
    zoom -= 0.5;
  }
});

document.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
});

logo.rotation.y = Math.PI / 3 / 2;
logo.rotation.x = -Math.PI / 6;

const clock = new THREE.Clock();
let deltaTime = 0;
let lastElapsedTime = clock.getElapsedTime();
let zooming = true;
let yRotation = 0;
const tick = () => {
  camera.position.set(1, zoom, 1);
  const elapsedTime = clock.getElapsedTime();
  deltaTime = elapsedTime - lastElapsedTime;
  lastElapsedTime = elapsedTime;

  if (elapsedTime > 0.5) {
    if (zoom < 0) {
      yRotation = 0.8;
      zooming = false;
    }
    if (zoom > defaultZoom) {
      zooming = true;
    }
    if (zooming) {
      zoom -= deltaTime * 10;
    } else {
      zoom += deltaTime * 10;
    }
    logo.rotation.y += deltaTime * yRotation;
    logo.rotation.x += deltaTime * 0.15;
  }

  requestAnimationFrame(tick);
  renderer.render(scene, camera);
};

tick();
