import './style.css';
import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { initializeApp } from 'firebase/app';
import { getFirestore } from "firebase/firestore";
import { collection, addDoc, getDocs, doc } from "firebase/firestore";
import SceneInitializer from './init';
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



// Parameters for configuration
const parameters = {
  isPaused: false,
  count: 500
};
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

const canvas = document.querySelector('canvas.webgl');
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
  colorArr,
  i = 0,
  currentIntersect;

// Clock for animations
const sceneInitializer = new SceneInitializer(sizes, canvas);
const clock = new THREE.Clock();
init();
animate();
function init() {
  // Create the camera
  // camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);
  sceneInitializer.setCameraPosition(0, 0, isMobile ? 20 : 10);

  //mesh standard material

  sceneInitializer.addSceneRectAreaLight();
  // Create the icosahedron group
  sceneInitializer.addIcosahedronGroupScene();

  for (let i = 0; i < parameters.count; i++) {
    sceneInitializer.createIcosahedrons();
  }


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
  const textOptions = {
    font,
    size: 2,
    height: 0.2,
    curveSegments: 12,
    bevelEnabled: false,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5,
  }
  sceneInitializer.clearTexts();
  content.innerHTML = title;
  body.innerHTML = contentArgs;
  sceneInitializer.addTextGroup(title, subject, textOptions);
  sceneInitializer.addTextGroupScene();
}

function animate() {


  sceneInitializer.updateController();
  if (!parameters.isPaused) {
    // Rotate and move the icosahedron objects
    sceneInitializer.updateIcosahedronGroup();

    const elapsedTime = clock.getElapsedTime();
    // Animate the camera position
    sceneInitializer.setCameraXPosition(elapsedTime);
    // Check camera position for text updates
    if (sceneInitializer.getCameraXPosition() > 150) {
      createText(textTitleArr[i + 1], textSubjectArr[i + 1], contentArr[i + 1]);
      parameters.isRunning = true;
      sceneInitializer.addRectAreaLightColor(colorArr[i + 1]);
      if (++i === 4) {
        i = 0;
      }
    }

  }
  sceneInitializer.render();
  sceneInitializer.interactRayCasterWithMouse();
  const objectsToTest = sceneInitializer.textGroup.children;
  const intersects = sceneInitializer.intersectObjects(objectsToTest);

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
  sceneInitializer.updateCameraAspect(sizes);
  sceneInitializer.renderSize(sizes);
});

window.addEventListener('mousemove', (event) => {
  event.preventDefault()
  sceneInitializer.setMouse(event, sizes);
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
