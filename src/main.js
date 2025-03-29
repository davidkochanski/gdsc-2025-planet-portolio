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


const loader = new THREE.TextureLoader();

const galaxyMap = loader.load("galaxy2.png");
const planetTexture = loader.load("planet_texture.jpg")
const planetNormal = loader.load("planet_normal.png")





const planetGeometry = new THREE.SphereGeometry(75, 32, 32);
const planetMaterial = new THREE.MeshStandardMaterial({ map: planetTexture, normalMap: planetNormal, emissive: true, emissiveIntensity: 1000 });
const planet = new THREE.Mesh(planetGeometry, planetMaterial);

scene.add(planet);

// const pointLight = new THREE.PointLight(0xffffff, 100000);

// const pointLightDistance = 1000;
// pointLight.position.set(-pointLightDistance, -pointLightDistance, pointLightDistance);
// scene.add(pointLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(100, 100, 100)
directionalLight.lookAt(0,0,0)

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




let planetRotation = 0;
const planetStep = Math.PI / 6000;

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);

    planetRotation += planetStep
  planet.setRotationFromAxisAngle(new THREE.Vector3(0,1,0), planetRotation)
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = rootElement.clientWidth / rootElement.clientHeight;
  camera.updateProjectionMatrix();
  controls.update();
  renderer.setSize(rootElement.clientWidth, rootElement.clientHeight);
});
