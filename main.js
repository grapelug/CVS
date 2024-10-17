import './style.css';
import * as THREE from 'https://unpkg.com/three@0.153.0/build/three.module.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Setup

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'), alpha: true
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);
camera.position.setX(-3);

renderer.render(scene, camera);

// Torus

const geometry = new THREE.TorusGeometry(5, 1, 16, 100);
const material = new THREE.MeshStandardMaterial({ color: 0xFF71F8,transparent: true, // Включаем прозрачность
opacity: 0.7 });
const torus = new THREE.Mesh(geometry, material);
torus.position.z = -2;

scene.add(torus);

// Lights

const light = new THREE.HemisphereLight(0x71F8FF, 0xFFEC71, 2 );
const pointlight = new THREE.PointLight( 0xff0000, 1, 100 );
light.position.set( 5, 5, 5 );
const directionalLight = new THREE.DirectionalLight( 0xffffff, 3 );
scene.add( directionalLight );
scene.add( light, pointlight );

// Helpers

// const lightHelper = new THREE.PointLightHelper(pointlight);
// const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(lightHelper, gridHelper);

// const controls = new OrbitControls(camera, renderer.domElement);

function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0x30E3FF });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
}

Array(200).fill().forEach(addStar);

// Background

scene.background = new THREE.Color(0x000000);

// Avatar
const loader = new GLTFLoader();

let moon; // Объявляем переменную для хранения модели

loader.load('scene.glb', function (gltf) { 
  const object = gltf.scene;
  console.log('Model loaded:', gltf); // Лог для проверки загрузки модели
  scene.add(object);

  object.scale.set(1.5, 1.5, 1.5);
  object.position.z = -5;
  object.position.x = 2;
  object.position.y = -3;
  object.rotation.x = 0.5;
  object.rotation.y = -0.8;

  // Scroll Animation

  function moveCamera() {
    const t = document.body.getBoundingClientRect().top;

    if (moon) {
      moon.rotation.x += 0.05;
      moon.rotation.y += 0.075;
      moon.rotation.z += 0.05;
    }

    object.rotation.y += 0.05;

    camera.position.z = t * -0.01;
    camera.position.x = t * -0.0002;
    camera.rotation.y = t * -0.0002;
  }

  document.body.onscroll = moveCamera;
  moveCamera();

}, undefined, function(error) {
  console.error('An error occurred while loading the model:', error);
});

// Moon Model
const moonLoader = new GLTFLoader();

moonLoader.load('new.glb', function (gltf) { 
  moon = gltf.scene; // Присваиваем загруженную модель переменной moon
  console.log('New Model loaded:', gltf); // Лог для проверки загрузки модели
  scene.add(moon);

  moon.scale.set(1, 1, 1);
  moon.position.z = 30;
  moon.position.x = -10;
}, undefined, function(error) {
  console.error('An error occurred while loading the new model:', error);
});

// Animation Loop

function animate() {
  requestAnimationFrame(animate);

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  if (moon) {
    moon.rotation.x += 0.005;
  }

  // controls.update();

  renderer.render(scene, camera);
}

animate();
