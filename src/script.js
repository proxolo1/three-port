import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
// import { ParallaxBarrierEffect } from 'three/examples/jsm/effects/ParallaxBarrierEffect';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
let i = 1, isPaused = false, isRunning = false;
// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();
//font

const fontLoader = new FontLoader();
fontLoader.load('/fonts/helvetiker_regular.typeface.json', (font) => {
  initFonts(font);
});
// Debug

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Textures
const textureLoader = new THREE.TextureLoader();
const materialOptions = {
  matcapTexture: textureLoader.load('textures/matcaps/8.png'),
  cometTexture: textureLoader.load('/symbol_02.png'),
  standardMaterial: new THREE.MeshStandardMaterial(),
};

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);
camera.position.set(0, 0, 15);

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enableZoom = true;
controls.enableRotate = true;

// Lights
const rectAreaLight = new THREE.RectAreaLight(0xb60707, 1, 100, 20);
rectAreaLight.position.z = 10;
scene.add(rectAreaLight);

// const pointLight = new THREE.PointLight(0x5c5c5c, 0.8, 10, 1);
// pointLight.position.z = -2;
// pointLight.position.x = 5;
// scene.add(pointLight);

// Donuts
const donutArr = [];
const donutGeometry = new THREE.IcosahedronGeometry(1, 0);
const donutCount = 1000;


for (let i = 0; i < donutCount; i++) {
  const donut = new THREE.Mesh(donutGeometry, materialOptions.standardMaterial);
  donut.position.set(
    (Math.random() - 0.5) * 50,
    (Math.random() - 0.5) * 50,
    (Math.random() - 0.5) * 50
  );
  donut.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
  const scale = Math.random() / 2;
  donut.scale.set(scale, scale, scale);
  donutArr.push(donut);
  scene.add(donut);
}

// Text

function initFonts(font) {

}

const textGroup = new THREE.Group();
const textTitleArr = [`H E L L O  : )`, `A J A Y K S A N T H O S H`, `Unleashing Passion through Programming`, `Associate Software Developer / UST, Trivandrum`, `T H A N K S >_< `];
const textSubjectArr = [``, `Developer`, `js | java | html | css | mysql`, `From 15 Sep 21 To Present`, '#threejs'];
const colorArr = [0xb60707, 0x07b6a2, 0x4db607, 0xb66d07, 0xff00f7];
// createText(textTitleArr[0], textSubjectArr[0]);

function createText(title, subject) {
  fontLoader.load('/fonts/helvetiker_regular.typeface.json', (font) => {
    const textGeometry = new TextGeometry(title, {
      font,
      size: 2,
      height: 0.2,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.02,
      bevelOffset: 0,
      bevelSegments: 5,
    });
    textGeometry.center();
    const text = new THREE.Mesh(textGeometry, materialOptions.standardMaterial);
    text.scale.set(0.3, 0.3, 1);

    const textGeometryDeveloper = new TextGeometry(subject, {
      font,
      size: 0.5,
      height: 0.2,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.02,
      bevelOffset: 0,
      bevelSegments: 5,
    });
    const developerText = new THREE.Mesh(textGeometryDeveloper, materialOptions.standardMaterial);
    textGeometryDeveloper.center();
    developerText.position.set(3.5, -1.5, 0);

    textGroup.clear();
    textGroup.add(text);
    textGroup.add(developerText);
    scene.add(textGroup);
    textGeometry.dispose();
    textGeometryDeveloper.dispose();
    materialOptions.standardMaterial.dispose();
  });
}

// Event listeners
document.addEventListener('dblclick', () => {
  if (!document.webkitFullscreenElement) {
    if (canvas.requestFullScreen) {
      canvas.requestFullScreen();
    } else if (canvas.webkitRequestFullScreen) {
      canvas.webkitRequestFullScreen();
    } else if (canvas.mozRequestFullScreen) {
      canvas.mozRequestFullScreen();
    }
  } else {
    document.webkitExitFullscreen();
  }
});

var holdTimeout;
var holdDuration = 500; // Define the duration (in milliseconds) for a "hold" event

// Function to handle the "hold" event
function handleHold() {
  // Perform actions for the "hold" event
  isPaused = true;
}

// Function to start the hold timer
function startHoldTimer() {
  holdTimeout = setTimeout(function () {
    // handleHold();
  }, holdDuration);

}

// Function to clear the hold timer
function clearHoldTimer() {

  if (isPaused) {
    isPaused = false;
    animate();
  }



  clearTimeout(holdTimeout);
}

// Add event listeners for mouse/touch events
document.addEventListener('mousedown', startHoldTimer);
document.addEventListener('mouseup', clearHoldTimer);
document.addEventListener('touchstart', startHoldTimer);
document.addEventListener('touchend', clearHoldTimer);


window.addEventListener('resize', () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Animation
const clock = new THREE.Clock();

function animate() {
  const elapsedTime = clock.getElapsedTime();

  controls.update();


  donutArr.forEach((donut) => {

    donut.rotation.y += 0.01;
    donut.rotation.x += 0.01;
    donut.position.z += 0.02;

    if (donut.position.z > 15) {
      donut.position.z = (Math.random() * -1) * 50;
    }
  });

  camera.position.y = Math.sin(elapsedTime / 3) * 10;
  camera.position.x = Math.tan(elapsedTime / 3);
  // camera.position.z = - Math.sin(elapsedTime / 4) * 8
  if (camera.position.x > 150 && !isRunning) {
    createText(textTitleArr[i], textSubjectArr[i]);
    isRunning = true;
    rectAreaLight.color.set(colorArr[i]);
    // particleMaterial.color.set(colorArr[i])
    if (++i == 5) {
      i = 0;
    }
  } else if (camera.position.x < 0) {
    isRunning = false;
  }
  renderer.render(scene, camera)
  if (!isPaused) {
    requestAnimationFrame(animate);
  }
}

animate();
