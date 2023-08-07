import './style.css';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { initializeApp } from 'firebase/app';
import { doc, getFirestore } from "firebase/firestore";
import { collection, addDoc, getDocs } from "firebase/firestore";
import SceneInitializer from './proxolo';
import Config from './config';
import data from './data.json';
import GUI from 'lil-gui';
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const parameters = {
  hire: () => parameters.index = 3,
  isPaused: false,
  index: 0,
  count: 100,
  sizes: {
    width: window.innerWidth,
    height: window.innerHeight
  },
  colorArr: [0xb60707, 0x07b6a2, 0x4db607, 0xb66d07, 0xff00f7],
  textOptions: {
    height: 0.2,
    curveSegments: 5,
    bevelEnabled: true,
    bevelThickness: 0.01,
    bevelSize: 0.01,
    bevelOffset: 0,
    bevelSegments: 2,
  }
};
const gui = new GUI({ autoPlace: false });
const canvas = document.querySelector('canvas.webgl');
const contentDiv = document.querySelector('.content .title');
const body = document.querySelector('.content .body');
const about = document.querySelector('.about');
const skill = document.querySelector('.skill')
const experience = document.querySelector('.experience')
const hire = document.querySelector('.hire-me');
let font, currentIntersect;
const sceneInitializer = new SceneInitializer(parameters.sizes, canvas);
const firebase = new Config();
export function start() {

  sceneInitializer.setCameraPosition(0, 0, isMobile ? 30 : 15);
  loadFont();
  animate();
};
function loadFont() {
  const loader = new FontLoader();
  loader.load('/fonts/helvetiker_regular.typeface.json', (_font) => {
    font = _font;
    createText(data.title[parameters.index], data.footer[parameters.index], data.content[parameters.index]);
  });
}

function createText(title, footer, content) {
  parameters.textOptions.font = font;
  contentDiv.innerHTML = title;
  body.innerHTML = content;
  sceneInitializer.addTextGroup(title, footer, parameters.textOptions);
}

function animate() {
  sceneInitializer.updateController();
  if (!parameters.isPaused) {
    sceneInitializer.updateElaspsedTime();
    // sceneInitializer.setCameraXPosition();
    // if (sceneInitializer.getCameraXPosition() > 120) {
    //   createText(data.title[parameters.index + 1], data.footer[parameters.index + 1], data.content[parameters.index + 1]);
    //   parameters.isRunning = true;
    //   parameters.index = parameters.index == 3 ? 0 : ++parameters.index;
    // }
  }
  sceneInitializer.render();
  sceneInitializer.interactRayCasterWithMouse();
  const objectsToTest = sceneInitializer.textGroup.children;
  const intersects = sceneInitializer.intersectObjects(objectsToTest);
  const delta = sceneInitializer.clock.getDelta();
  if (sceneInitializer.mixer) {
    sceneInitializer.mixer.update(delta)
  }
  if (intersects.length) {
    currentIntersect = intersects[0];
    if (currentIntersect) {
      document.body.style.cursor = 'pointer';
      openNav();
    }
  } else {
    if (currentIntersect) {
      document.body.style.cursor = 'default';
      // closeNav();
    }
    currentIntersect = null;
  }
  requestAnimationFrame(animate);
}
window.addEventListener('resize', () => {
  parameters.sizes.width = window.innerWidth;
  parameters.sizes.height = window.innerHeight;
  sceneInitializer.updateCameraAspect(parameters.sizes);
  sceneInitializer.renderSize(parameters.sizes);
});

window.addEventListener('mousemove', (event) => {
  event.preventDefault()
  sceneInitializer.setMouse(event, parameters.sizes);
});
canvas.addEventListener('click',closeNav)
document.querySelector('.closebtn').addEventListener('click',closeNav);

function openNav() {
  document.getElementById('mySidenav').style.width = '300px';
  parameters.isPaused = true;
}

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
gui.add(parameters, 'hire').name("hire")
gui.addColor(sceneInitializer.ambientLight, 'color')
gui.add(sceneInitializer.ambientLight.position, 'x').min(-10).max(30).step(1)
gui.add(sceneInitializer.ambientLight.position, 'y').min(-10).max(30).step(1)
gui.add(sceneInitializer.ambientLight.position, 'z').min(-10).max(30).step(1)
setTimeout(() => {
  gui.add(sceneInitializer.spaceship.scale, 'x').min(0).max(100).step(0.01);
  gui.add(sceneInitializer.spaceship.scale, 'y').min(0).max(100).step(0.01);
  gui.add(sceneInitializer.spaceship.scale, 'z').min(0).max(100).step(0.01);
  gui.add(sceneInitializer.spaceship.position, 'x').min(-100).max(100).step(0.01);
  gui.add(sceneInitializer.spaceship.position, 'y').min(-100).max(100).step(0.01);
  gui.add(sceneInitializer.spaceship.position, 'z').min(-100).max(100).step(0.01);
  gui.add(sceneInitializer.spaceship.rotation, 'x').min(-100).max(100).step(0.01);
  gui.add(sceneInitializer.spaceship.rotation, 'y').min(-100).max(100).step(0.01);
  gui.add(sceneInitializer.spaceship.rotation, 'z').min(-100).max(100).step(0.01);
}, 15000)
about.addEventListener('click', (event) => { createText(data.title[1], data.footer[1], data.content[1]); parameters.index++; sceneInitializer.changeAmbientColor(0x0062ff);closeNav() });
hire.addEventListener('click', (event) => { createText(data.title[4], data.footer[4], data.content[4]); parameters.index++; sceneInitializer.changeAmbientColor(0xffa200);closeNav() });
skill.addEventListener('click', (event) => { createText(data.title[2], data.footer[2], data.content[2]); parameters.index++; sceneInitializer.changeAmbientColor(0xff00ea);closeNav() });
experience.addEventListener('click', (event) => { createText(data.title[3], data.footer[3], data.content[3]); parameters.index++; sceneInitializer.changeAmbientColor(0x00eeff);closeNav() });

function bytesToMB(bytes) {
  return (bytes / (1024 * 1024)).toFixed(2);
}