import * as THREE from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
export default class SceneInitializer {
    constructor(sizes, canvas) {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ canvas });
        this.renderSize(sizes);
        this.controls = new OrbitControls(this.camera, canvas);
        this.controls.enableDamping = false;
        this.controls.enableZoom = false;
        this.controls.enableRotate = false;
        this.rectAreaLight = new THREE.RectAreaLight(0xb60707, 1, 100, 20);
        this.rectAreaLight.position.z = 10;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.icosahedronGroup = new THREE.Group();
        this.icosahedronGeometry = new THREE.OctahedronGeometry(3, 0);
        this.standardMaterial = new THREE.MeshStandardMaterial();
        this.textGroup = new THREE.Group();
        this.clock = new THREE.Clock();
        THREE.Cache.enabled = true;

    }
    addScene(object) {
        this.scene.add(object);
    }
    createIcosahedrons() {
        const icosahedron = new THREE.Mesh(this.icosahedronGeometry, this.standardMaterial);
        icosahedron.position.set(
            (Math.random() - 0.5) * 30,
            (Math.random() - 0.5) * 30,
            (Math.random() - 0.5) * 30
        );
        icosahedron.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
        const scale = Math.random() * 0.02;
        icosahedron.scale.set(scale, scale, scale);
        this.icosahedronGroup.add(icosahedron);
    }
    addIcosahedronGroupScene() {
        this.scene.add(this.icosahedronGroup);
    }
    updateIcosahedronGroup() {
        this.icosahedronGroup.children.forEach((icosahedron) => {
            icosahedron.rotation.y += 0.01;
            icosahedron.rotation.x += 0.01;
            icosahedron.position.z += 0.02;

            if (icosahedron.position.z > 15) {
                icosahedron.position.z = (Math.random() * -1) * 50;
            }
        });
    }
    addSceneRectAreaLight() {
        this.scene.add(this.rectAreaLight)
    }
    addRectAreaLightColor(color) {
        this.rectAreaLight.color.set(color);
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
        textOptions.size = 2;
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
        developerText.position.set(3.5, -1.5, 0);
        this.textGroup.add(planeMesh, text, developerText);
        this.scene.add(this.textGroup);
    }

    updateElaspsedTime() {
        this.elapsedTime = this.clock.getElapsedTime();
    }


}