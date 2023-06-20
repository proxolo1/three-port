import './style.css';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { initializeApp } from 'firebase/app';
import { getFirestore } from "firebase/firestore";
import { collection, addDoc, getDocs } from "firebase/firestore";
import SceneInitializer from './proxolo';
import Config from './config';
import data from './data.json'
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const parameters = {
  isPaused: false,
  count: 500,
  sizes: {
    width: window.innerWidth,
    height: window.innerHeight
  },
  colorArr: [0xb60707, 0x07b6a2, 0x4db607, 0xb66d07, 0xff00f7],
   textOptions: {
    size: 2,
    height: 0.2,
    curveSegments: 5,
    bevelEnabled: true,
    bevelThickness: 0.01,
    bevelSize: 0.01,
    bevelOffset: 0,
    bevelSegments: 2,
  }
};

const canvas = document.querySelector('canvas.webgl');
const contentDiv = document.querySelector('.content .title');
const body = document.querySelector('.content .body');
let font,i = 0,currentIntersect;
const sceneInitializer = new SceneInitializer(parameters.sizes, canvas);
const firebase = new Config();
(function () {
  sceneInitializer.setCameraPosition(0, 0, isMobile ? 20 : 10);
  sceneInitializer.addSceneRectAreaLight();
  sceneInitializer.addIcosahedronGroupScene();
  for (let i = 0; i < parameters.count; i++) {sceneInitializer.createIcosahedrons();}
  loadFont();
  animate();
})();

function loadFont() {
  const loader = new FontLoader();
  loader.load('/fonts/Gruppo_Regular.json', (_font) => {
    font = _font;
    createText(data.title[i], data.footer[i], data.content[i]);
  });
}

function createText(title, footer, content) {
  parameters.textOptions.font=font;
  contentDiv.innerHTML = title;
  body.innerHTML = content;
  sceneInitializer.addTextGroup(title, footer, parameters.textOptions);
}

function animate() {
  sceneInitializer.updateController();
  if (!parameters.isPaused) {
    sceneInitializer.updateIcosahedronGroup();
    sceneInitializer.updateElaspsedTime();
    sceneInitializer.setCameraXPosition();
    if (sceneInitializer.getCameraXPosition() > 120) {
      createText(data.title[i + 1], data.footer[i + 1], data.content[i + 1]);
      parameters.isRunning = true;
      sceneInitializer.addRectAreaLightColor(parameters.colorArr[i + 1]);
      i = i == 3 ? 0 : ++i;
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
