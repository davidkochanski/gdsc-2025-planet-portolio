import * as THREE from 'three';
import "./style.css";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(1000, window.innerWidth / window.innerHeight, 0.1, 10000);
camera.position.z = 200;

const rootElement = document.getElementById("space");

const renderer = new THREE.WebGLRenderer();
renderer.setSize(rootElement.clientWidth, rootElement.clientHeight);
rootElement.appendChild(renderer.domElement);

const controls = new OrbitControls( camera, rootElement );



const planetGeometry = new THREE.SphereGeometry(75, 32, 32);
const planetMaterial = new THREE.MeshToonMaterial({ color: "red" });
const planet = new THREE.Mesh(planetGeometry, planetMaterial);

scene.add(planet);

// const pointLight = new THREE.PointLight(0xffffff, 1000);

// const pointLightDistance = 75;
// pointLight.position.set(pointLightDistance, pointLightDistance, pointLightDistance);
// scene.add(pointLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
scene.add(directionalLight)


function randomRange(a, b) {
    return Math.random() * (b - a) + a;
}

function randomSign() {
    return Math.random() > 0.5 ? 1 : -1;
}

function generateSphericalCoords(rMin, rMax) {
    const rho = randomRange(rMin, rMax);
    const theta = randomRange(0, 2 * Math.PI);
    // const phi = randomRange(0, 1 * Math.PI);

    const phi = Math.acos(randomRange(0, 1));

    return [rho, theta, phi];
}



const numStars = 1000;

for(let i = 0; i < numStars; i++) {
    const starGeometry = new THREE.SphereGeometry(1);
    const starMaterial = new THREE.MeshStandardMaterial( {color: "white", emissive: "white", emissiveIntensity: 10000} )

    const star = new THREE.Mesh(starGeometry, starMaterial);
    
    // https://www.youtube.com/watch?v=_7Gt3Lla1pk
    const [rho, theta, phi] = generateSphericalCoords(600, 800);
    
    const x = rho * Math.sin(phi) * Math.cos(theta); 
    const y = rho * Math.sin(phi) * Math.sin(theta);
    const z = rho * randomSign() * Math.cos(phi);

    star.position.set(x, y, z);


    scene.add(star);
}






function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = rootElement.clientWidth / rootElement.clientHeight;
  camera.updateProjectionMatrix();
  controls.update();
  renderer.setSize(rootElement.clientWidth, rootElement.clientHeight);
});
