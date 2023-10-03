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
location.hash = '💫'

annonymous();
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
    curveSegments: 12,
    bevelEnabled: true,
    bevelOffset: 0,
    bevelThickness: 0.1,
    bevelSize: 0.3,
    bevelSegments: 5
  }
};
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
export async function start() {
  sceneInitializer.setCameraPosition(0, 0, isMobile ? 30 : 15);
  font = await loadFont('/fonts/helvetiker_regular.typeface.json');
  createText(data.title[parameters.index], data.footer[parameters.index], data.content[parameters.index]);
  animate();
};
function loadFont(url) {
  const loader = new FontLoader();
  return new Promise((resolve, reject) => {
    loader.load(url, resolve, undefined, reject);
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
canvas.addEventListener('click', closeNav)
document.querySelector('.closebtn').addEventListener('click', closeNav);

function openNav() {
  document.getElementById('mySidenav').style.width = '300px';
  parameters.isPaused = true;
}

function closeNav() {
  document.getElementById('mySidenav').style.width = '0';
  parameters.isPaused = false;
}


function annonymous() {
  const firebaseConfig =
  {
    apiKey: "AIzaSyDqeIeHdTodMCizOlA6uAxn7S0qAT7h3Ws",
    authDomain: "proxoloo.firebaseapp.com",
    projectId: "proxoloo",
    storageBucket: "proxoloo.appspot.com",
    messagingSenderId: "256159945638",
    appId: "1:256159945638:web:45388f7e0073d3cf523567",
    measurementId: "G-TTMHVYJPXE"
  };
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  if (!localStorage.getItem("HdTodMCkaLMSKDIILSLDLS")) {
    fetch('https://api.ipify.org?format=json').then(Response => {
      Response.json().then(result => {

        localStorage.setItem("HdTodMCkaLMSKDIILSLDLS", result.ip);
         addDoc(collection(db, "wru"), {
              data: window.location.search,
              time: Date(),
              ip: result.ip
              // info_ip: info
            });
        // fetch(`http://ip-api.com/json/${result.ip}`).then(details => {
        //   details.json().then(info => {
        //     addDoc(collection(db, "wru"), {
        //       data: window.location.search,
        //       time: Date(),
        //       ip: result.ip,
        //       info_ip: info
        //     });
        //   })
        // })

      }).catch(error => console.log(error))
    })
      

  }

  // fetch('https://api.ipify.org?format=json')
  //   .then(response => response.json())
  //   .then(data => {
  //     const app = initializeApp(firebaseConfig);
  //     const db = getFirestore(app);
  //     getDocs(collection(db, 'users')).then(doc => {
  //       doc.forEach(doc => {
  //         if (!(data.ip == doc.data().ipAddress)) {
  //           addDoc(collection(db, "users"), {
  //             name: navigator.userAgent,
  //             ipAddress: data.ip
  //           });
  //         }

  //       })
  //     })

  //   })
  //   .catch(error => {
  //     console.error('Error retrieving IP address:', error);
  //   });
}

about.addEventListener('click', () => { createText(data.title[1], data.footer[1], data.content[1]); parameters.index++; sceneInitializer.changeAmbientColor(0x0062ff); closeNav() });
hire.addEventListener('click', () => { createText(data.title[4], data.footer[4], data.content[4]); parameters.index++; sceneInitializer.changeAmbientColor(0x0062ff); closeNav() });
skill.addEventListener('click', () => { createText(data.title[2], data.footer[2], data.content[2]); parameters.index++; sceneInitializer.changeAmbientColor(0x00eeff); closeNav() });
experience.addEventListener('click', () => { createText(data.title[3], data.footer[3], data.content[3]); parameters.index++; sceneInitializer.changeAmbientColor(0x00eeff); closeNav() });

function bytesToMB(bytes) {
  return (bytes / (1024 * 1024)).toFixed(2);
}