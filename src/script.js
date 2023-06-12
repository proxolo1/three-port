import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { initializeApp } from 'firebase/app';
import { getFirestore } from "firebase/firestore";
import { collection, addDoc, getDocs, doc } from "firebase/firestore";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyDqeIeHdTodMCizOlA6uAxn7S0qAT7h3Ws",
  authDomain: "proxoloo.firebaseapp.com",
  projectId: "proxoloo",
  storageBucket: "proxoloo.appspot.com",
  messagingSenderId: "256159945638",
  appId: "1:256159945638:web:45388f7e0073d3cf523567",
  measurementId: "G-TTMHVYJPXE"
};

// Check if the user is using a mobile device
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// Enable caching in Three.js
THREE.Cache.enabled = true;

// Clock for animations
const clock = new THREE.Clock();

// Parameters for configuration
const parameters = {
  isPaused: false,
  isRunning: false,
  count: 500,
};
// Texture
const textureLoader = new THREE.TextureLoader()
const rockyColorTexture = textureLoader.load('/texture/GroundDirtRocky002_COL_2K.jpg');
// const rockyAlphaTexture=textureLoader.load('/texture/GroundDirtRocky002_AO_2K.jpg');
const rockyAmbientOcclusionTexture = textureLoader.load('/texture/GroundDirtRocky002.jpg');
const rockyNormalTexture = textureLoader.load('/texture/GroundDirtRocky002_NRM_2K.jpg');
const rockyDisplacementTexture = textureLoader.load('/texture/GroundDirtRocky002_DISP_2K.jpg')
// Arrays for text content
const textSubjectArr = [
  '',
  'Developer',
  'Java Fullstack Developer',
  '15 Sep 21 To Present',
  'Thanks',
];
const textTitleArr = [
  'H E L L O  : )',
  'A J A Y K S A N T H O S H',
  'Unleashing Passion through Programming',
  'Associate Developer 1 / UST',
  'H I R E M E >_<',
];
const contentArr = [
  `Three.js-based interactive portfolio website that showcases various 3D elements and text animations. It utilizes 3D geometries, materials, and lighting effects to create an immersive visual experience. The program includes dynamic camera movement, object rotations, and text animations triggered by the camera position. It also incorporates mouse interaction, allowing users to click on the displayed text to open and close a side navigation menu. The program demonstrates the use of Three.js library and its capabilities for creating engaging and interactive web experiences.`,
  `As a passionate and skilled programmer, you have dedicated yourself to the field for over 1.8 years, focusing on the development of software using technologies such as Spring Boot, Angular, and MySQL. Your primary responsibility involves programming, where you actively contribute to the creation and enhancement of various software applications. Through your commitment and expertise, you strive to deliver high-quality code and contribute to the success of your projects.`,
  `<p>HTML</p><div class="container">
  
  <div class="skills html">90%</div>
</div>

<p>CSS</p>
<div class="container">
  <div class="skills css">90%</div>
</div>

<p>JavaScript</p>
<div class="container">
  <div class="skills js">80%</div>
</div>

<p>Java</p>
<div class="container">
  <div class="skills java">78%</div>
</div>

<p>Spring boot</p>
<div class="container">
  <div class="skills spring">70%</div>
</div>
<p>Angular</p>
<div class="container">
  <div class="skills angular">80%</div>
</div>
<p>Mysql</p>
<div class="container">
  <div class="skills mysql">70%</div>
</div>
<p>Mongo Db</p>
<div class="container">
  <div class="skills mongo">30%</div>
</div>
<p>Bootstrap</p>
<div class="container">
  <div class="skills bootstrap">90%</div>
</div>
<p>Aws</p>
<div class="container">
  <div class="skills aws">20%</div>
</div>
<p>Firebase</p>
<div class="container">
  <div class="skills firebase">70%</div>
</div>
`,
  `pending....`,
  "pending....",
];

// Get the canvas and create the scene
const canvas = document.querySelector('canvas.webgl');
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x000000, 0.0008);

// Sizes for the renderer
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// DOM elements
let content = document.querySelector('.content .title');
let body = document.querySelector('.content .body');

// Variables for Three.js objects and materials
let font,
  camera,
  renderer,
  controls,
  rectAreaLight,
  icosahedronGroup,
  colorArr,
  textGroup,
  i = 0,
  raycaster,
  standardMaterial,
  currentIntersect;

// Mouse position
const mouse = new THREE.Vector2();
// Usage
const textToSave = 'This is the text I want to save';
const apiKey = '1T8Fih1D8qTqMpLA4e6xzbsnjto2J-ow'; // You'll need to sign up for a free Pastebin API key
annonymous();
init();
animate();

function init() {
  // Create the camera
  camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);
  camera.position.set(0, 0, isMobile ? 20 : 10);

  // Create the renderer
  renderer = new THREE.WebGLRenderer({ canvas });
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  //mesh standard material
  standardMaterial = new THREE.MeshStandardMaterial();
  // Create the controls
  controls = new OrbitControls(camera, canvas);
  controls.enableDamping = false;
  controls.enableZoom = false;
  controls.enableRotate = false;

  // Create the rect area light
  rectAreaLight = new THREE.RectAreaLight(0xb60707, 1, 100, 20);
  rectAreaLight.position.z = 10;
  scene.add(rectAreaLight);
  // Create the icosahedron group
  icosahedronGroup = new THREE.Group();
  scene.add(icosahedronGroup);

  const icosahedronGeometry = new THREE.IcosahedronGeometry(1, 0)
  for (let i = 0; i < parameters.count; i++) {
    const icosahedron = new THREE.Mesh(icosahedronGeometry, standardMaterial);
    icosahedron.position.set(
      (Math.random() - 0.5) * 70,
      (Math.random() - 0.5) * 70,
      (Math.random() - 0.5) * 70
    );
    icosahedron.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
    const scale = Math.random() * 0.3;
    icosahedron.scale.set(scale, scale, scale);
    icosahedronGroup.add(icosahedron);
  }
  raycaster = new THREE.Raycaster();

  const rayOrigin = new THREE.Vector3(-3, 0, 0);
  const rayDirection = new THREE.Vector3(10, 0, 0);
  rayDirection.normalize();
  textGroup = new THREE.Group();
  colorArr = [0xb60707, 0x07b6a2, 0x4db607, 0xb66d07, 0xff00f7];
  loadFont();
}

function loadFont() {
  const loader = new FontLoader();
  loader.load('/fonts/Gruppo_Regular.json', (_font) => {
    font = _font;
    createText(textTitleArr[i], textSubjectArr[i], contentArr[i]);
  });
}

function createText(title, subject, contentArgs) {
  textGroup.clear();

  // Create the plane
  const planeGeometry = new THREE.PlaneGeometry(15, 2);
  const planeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0 });
  const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
  textGroup.add(planeMesh);

  // Set the title and content
  content.innerHTML = title;
  body.innerHTML = contentArgs;

  // Create the title text
  const textGeometry = new TextGeometry(title, {
    font,
    size: 2,
    height: 0.2,
    curveSegments: 12,
    bevelEnabled: false,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5,
  });
  textGeometry.center();
  const text = new THREE.Mesh(textGeometry, standardMaterial);
  text.scale.set(0.3, 0.3, 1);

  // Create the subject text
  const textGeometryDeveloper = new TextGeometry(subject, {
    font,
    size: 0.5,
    height: 0.2,
    curveSegments: 12,
    bevelEnabled: false,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5,
  });
  textGeometryDeveloper.center();
  const developerText = new THREE.Mesh(textGeometryDeveloper, standardMaterial);
  developerText.position.set(3.5, -1.5, 0);

  textGroup.add(text);
  textGroup.add(developerText);
  scene.add(textGroup);

  textGeometry.dispose();
  textGeometryDeveloper.dispose();
}

function animate() {


  controls.update();
  if (!parameters.isPaused) {
    // Rotate and move the icosahedron objects
    icosahedronGroup.children.forEach((icosahedron) => {
      icosahedron.rotation.y += 0.01;
      icosahedron.rotation.x += 0.01;
      icosahedron.position.z += 0.02;

      if (icosahedron.position.z > 15) {
        icosahedron.position.z = (Math.random() * -1) * 50;
      }
    });

    const elapsedTime = clock.getElapsedTime();
    // Animate the camera position
    camera.position.y = Math.sin(elapsedTime * 0.2) * 2;
    camera.position.x = Math.tan(elapsedTime * 0.4);

    // Check camera position for text updates
    if (camera.position.x > 150 && !parameters.isRunning) {
      createText(textTitleArr[i + 1], textSubjectArr[i + 1], contentArr[i + 1]);
      parameters.isRunning = true;
      rectAreaLight.color.set(colorArr[i + 1]);
      if (++i === 4) {
        i = 0;
      }
    } else if (camera.position.x < 0) {
      parameters.isRunning = false;
    }
  }
  renderer.render(scene, camera);
  raycaster.setFromCamera(mouse, camera);

  const objectsToTest = textGroup.children;
  const intersects = raycaster.intersectObjects(objectsToTest);

  if (intersects.length) {
    if (!currentIntersect) {
      document.body.style.cursor = 'pointer';
      openNav();
    }
    currentIntersect = intersects[0];
  } else {
    if (currentIntersect) {
      document.body.style.cursor = 'default';
      closeNav();
    }
    currentIntersect = null;
  }
  requestAnimationFrame(animate);
}

// document.addEventListener('dblclick', fullscreen);

window.addEventListener('resize', () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

window.addEventListener('mousemove', (event) => {
  event.preventDefault()
  mouse.x = event.clientX / sizes.width * 2 - 1;
  mouse.y = - (event.clientY / sizes.height) * 2 + 1;
});


function openNav() {
  document.getElementById('mySidenav').style.width = '300px';
  parameters.isPaused = true;
}

/* Set the width of the side navigation to 0 and the left margin of the page content to 0 */
function closeNav() {
  document.getElementById('mySidenav').style.width = '0';
  parameters.isPaused = false;
}

function fullscreen() {
  if (canvas.requestFullscreen) {
    canvas.requestFullscreen();
  } else if (canvas.mozRequestFullScreen) {
    canvas.mozRequestFullScreen();
  } else if (canvas.webkitRequestFullscreen) {
    canvas.webkitRequestFullscreen();
  } else if (canvas.msRequestFullscreen) {
    canvas.msRequestFullscreen();
  }
}


function annonymous() {
  fetch('https://api.ipify.org?format=json')
    .then(response => response.json())
    .then(data => {
      const app = initializeApp(firebaseConfig);
      const db = getFirestore(app);
      getDocs(collection(db, 'users')).then(doc => {
        doc.forEach(doc => {
          if (!(data.ip == doc.data().ipAddress)) {
            addDoc(collection(db, "users"), {
              name: navigator.userAgent,
              ipAddress: data.ip
            });
          }

        })
      })

    })
    .catch(error => {
      console.error('Error retrieving IP address:', error);
    });
}