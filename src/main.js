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

const pointLight = new THREE.PointLight(0xffffff, 10000);

const pointLightDistance = 60;
pointLight.position.set(pointLightDistance, pointLightDistance, pointLightDistance);
scene.add(pointLight);

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
const galaxyMap = new THREE.TextureLoader().load("galaxy2.png");

for(let i = 0; i < numStars; i++) {
    let obj;

    if (Math.random() < 0.05) { // 5% chance at galaxy replacing star
        const galaxyMaterial = new THREE.MeshBasicMaterial({ 
            map: galaxyMap,
            transparent: true,
            side: THREE.DoubleSide,
          });
        
          const galaxyGeometry = new THREE.PlaneGeometry(randomRange(30,100), randomRange(30,100));
          obj = new THREE.Mesh(galaxyGeometry, galaxyMaterial);

    

    } else {
        const starGeometry = new THREE.SphereGeometry(1.5);
        const starMaterial = new THREE.MeshStandardMaterial( {color: "white", emissive: "white", emissiveIntensity: 1} )
        obj = new THREE.Mesh(starGeometry, starMaterial);

    }

    // https://www.youtube.com/watch?v=_7Gt3Lla1pk
    const [rho, theta, phi] = generateSphericalCoords(600, 800);

    const x = rho * Math.sin(phi) * Math.cos(theta); 
    const y = rho * Math.sin(phi) * Math.sin(theta);
    const z = rho * randomSign() * Math.cos(phi);

    obj.position.set(x, y, z);
    obj.lookAt(0,0,0);

    scene.add(obj);

    
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
