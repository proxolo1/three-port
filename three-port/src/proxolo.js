import * as THREE from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { start } from './script';
import { doc } from 'firebase/firestore';
import gsap from 'gsap';
export default class SceneInitializer {
    constructor(sizes, canvas) {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ canvas });
        this.renderSize(sizes);
        this.ambientLight = new THREE.AmbientLight(0x0062ff, 3);
        this.controls = new OrbitControls(this.camera, canvas);
        this.controls.enableDamping = true;
        this.controls.enableZoom = false;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.standardMaterial =  [
            new THREE.MeshBasicMaterial({
               color: 0x000000,
            flatShading: true
            }), // front
            new THREE.MeshBasicMaterial({
            color: 0xffffff
            }) // side
         ]
        this.textGroup = new THREE.Group();
        this.clock = new THREE.Clock();
        THREE.Cache.enabled = true;
        this.scene.add(this.ambientLight);
        this.loadGLTF();
    }

    setCameraPosition(x, y, z) {
        this.camera.position.set(x, y, z);
    }
    setCameraXPosition() {
        this.camera.position.x = Math.tan(this.elapsedTime * 0.4);
    }
    getCameraXPosition() {
        return this.camera.position.x;
    }

    updateCameraAspect(size) {
        this.camera.aspect = size.width / size.height;
        this.camera.updateProjectionMatrix();
    }
    render() {
        this.renderer.render(this.scene, this.camera)
    }
    renderSize(sizes) {
        this.renderer.setSize(sizes.width, sizes.height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }
    updateController() {
        this.controls.update();
    }
    interactRayCasterWithMouse() {
        this.raycaster.setFromCamera(this.mouse, this.camera)
    }
    intersectObjects(objects) {
        return this.raycaster.intersectObjects(objects);
    }
    setMouse(event, sizes) {
        this.mouse.x = event.clientX / sizes.width * 2 - 1;
        this.mouse.y = - (event.clientY / sizes.height) * 2 + 1;
    }
    clearTexts() {
        this.textGroup.clear();
    }
    addTextGroup(title, subject, textOptions) {
        this.clearTexts();
        textOptions.size = 2.5;
        const planeGeometry = new THREE.PlaneGeometry(15, 2);
        const planeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0 });
        const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
        const textGeometry = new TextGeometry(title, textOptions);
        textGeometry.center();
        const text = new THREE.Mesh(textGeometry, this.standardMaterial);
        text.scale.set(0.3, 0.3, 1);
        textOptions.size = 0.5;
        const textGeometryDeveloper = new TextGeometry(subject, textOptions);
        textGeometryDeveloper.center();
        const developerText = new THREE.Mesh(textGeometryDeveloper, this.standardMaterial);
        developerText.position.set(4.5, -1.5, 0);
        this.textGroup.add(planeMesh, text, developerText);
        this.scene.add(this.textGroup);
    }

    updateElaspsedTime() {
        this.elapsedTime = this.clock.getElapsedTime();
    }
    spaceshipRotate() {
        this.spaceship.rotation.x = Math.cos(this.clock.getDelta()) * 100;
    }
    bytesToMB(bytes) {
        return (bytes / (1024 * 1024)).toFixed(2);
    }
    changeAmbientColor(color) {
        gsap.to(this.spaceship.rotation, { duration: 5, z: Math.random() * 2, ease: "easeIn" })
        gsap.to(this.spaceship.rotation, { duration: 5, x: Math.random() * 2, ease: "easeIn" })
        gsap.to(this.spaceship.rotation, { duration: 5, y: Math.random() * 2, ease: "easeIn" })
        this.ambientLight.color = new THREE.Color(color);
    }
    loadGLTF() {
        const GLTF = new GLTFLoader();
        GLTF.load('space_station_3.glb', (gltf) => {
            gltf.scene.scale.set(50, 50, 50);
            gltf.scene.position.set(-60, -23, -50);
            const animation = gltf.animations;
            this.mixer = new THREE.AnimationMixer(gltf.scene);
            const action = this.mixer.clipAction(animation[0]);
            action.play();
            this.scene.add(gltf.scene)
            this.spaceship = gltf.scene;
            const videoElement = document.getElementById("loading-video");
            videoElement.parentNode.removeChild(videoElement)
            document.querySelector('.progress-bar').style.display = 'none';
            start();
        }, (ProgressEvent) => {
            document.querySelector(".status").style.width = `${Math.floor((ProgressEvent.loaded / ProgressEvent.total) * 100)}%`;
            document.querySelector(".mb").innerHTML = this.bytesToMB(ProgressEvent.loaded);
        })
    }
}