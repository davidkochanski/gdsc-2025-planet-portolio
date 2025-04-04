import * as THREE from 'three';
import "./style.css";
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';
import {generateSphericalCoords, polarToCartesian, randomRange, randomSign} from "./math"
import { GITHUB, LINKEDIN, PROJECT1, PROJECT2, PROJECT3 } from './urls';

// ##############################################
// Initial Setup
// ##############################################

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(1000, window.innerWidth / window.innerHeight, 0.1, 10000);
camera.up.set(0,0,1);

const cameraInitialDistance = 200;
const cameraInitialTheta = 1.5 * Math.PI;
const cameraInitialPhi = 0.1 * Math.PI;

const [ix, iy, iz] = polarToCartesian(cameraInitialDistance, cameraInitialTheta, cameraInitialPhi)
camera.position.set(ix, iy, iz)

const rootElement = document.getElementById("space");

const renderer = new THREE.WebGLRenderer();
renderer.setSize(rootElement.clientWidth, rootElement.clientHeight);
rootElement.appendChild(renderer.domElement);

// ##############################################
// Trackball Controls (Interactive camera)
// ##############################################

const controls = new TrackballControls(camera, renderer.domElement);
controls.rotateSpeed = 3.0;
controls.zoomSpeed = 0.1;
controls.minDistance = 100;
controls.maxDistance = 1000;
controls.panSpeed = 0.8;
controls.noZoom = false;
controls.noPan = true;
controls.dynamicDampingFactor = 0.3;

// ##############################################
// Load Textures
// ##############################################

const loader = new THREE.TextureLoader();

const galaxyMap = loader.load("galaxy.png");
const planetMap = loader.load("planet_texture.jpg");
const moonMap = loader.load("moon_texture.jpg");

const planetNormal = loader.load("planet_normal.png");
const moonNormal = loader.load("moon_normal.png");

const linkedinMap = loader.load("linkedin.png");
const githubMap = loader.load("github.png");

const flagFrontMap = loader.load("welcome_flag_front.png");
const flagBackMap = loader.load("welcome_flag_back.png");

const boardFrontMap = loader.load("board_front.png");
const boardBackMap = loader.load("board_back.png");

const project1Map = loader.load("project1.png");
const project2Map = loader.load("project2.png");
const project3Map = loader.load("project3.png");

// ##############################################
// Main Planet
// ##############################################

const PLANET_RADIUS = 75;

const planetGeometry = new THREE.SphereGeometry(PLANET_RADIUS, 32, 32);
const planetMaterial = new THREE.MeshStandardMaterial({ color: "#DC143C", normalMap: planetNormal, emissive: true, emissiveIntensity: 1000 });
const planet = new THREE.Mesh(planetGeometry, planetMaterial);
scene.add(planet);

// ##############################################
// Lighting
// ##############################################

const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(100, 100, 100)
directionalLight.lookAt(0,0,0)
scene.add(directionalLight)

// ##############################################
// Skybox Background
// ##############################################

const cubeLoader = new THREE.CubeTextureLoader();
const skybox = cubeLoader.load([
  'px.jpg', 'nx.jpg',
  'py.jpg', 'ny.jpg',
  'pz.jpg', 'nz.jpg'
]);

scene.background = skybox;

// ##############################################
// Stars and Galaxies
// ##############################################

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
        const starGeometry = new THREE.SphereGeometry(randomRange(2,5));
        const starMaterial = new THREE.MeshStandardMaterial( {color: "white", emissive: "white", emissiveIntensity: 1} )
        obj = new THREE.Mesh(starGeometry, starMaterial);
    }

    // https://www.youtube.com/watch?v=_7Gt3Lla1pk
    const [rho, theta, phi] = generateSphericalCoords(1000, 8000);
    const [x,y,z] = polarToCartesian(rho, theta, phi);

    obj.position.set(x, y, z * randomSign());
    obj.lookAt(0,0,0);

    scene.add(obj);

}

// ##############################################
// Moon
// ##############################################

const MOON_DISTANCE = 300;
const MOON_SIZE = 24;
const MOON_STEP = Math.PI / 1200
const MOON_TILT = Math.PI / 3

const moonGeometry = new THREE.SphereGeometry(MOON_SIZE, 16, 16);
const moonMaterial = new THREE.MeshStandardMaterial({ map: moonMap, normalMap: moonNormal});
const moon = new THREE.Mesh(moonGeometry, moonMaterial);
scene.add(moon);

let moonAngle = 0;

// Will be called every frame
function updateMoonPosition() {
    moonAngle += MOON_STEP;
    const theta = moonAngle;
    const phi = MOON_TILT;
    
    const [x,y,z] = polarToCartesian(MOON_DISTANCE, theta, phi)  
    
    moon.position.set(x, y, z);
}

// ##############################################
// Define items on the planet
// ##############################################

const flagGeometry = new THREE.BoxGeometry(50, 50, 0);

const flagFrontMaterial = new THREE.MeshToonMaterial({map: flagFrontMap, transparent: true});
const flagBackMaterial = new THREE.MeshToonMaterial({map: flagBackMap, transparent: true});
const empty = new THREE.MeshToonMaterial({color: "black"})
const flag = new THREE.Mesh(flagGeometry, [ empty, empty, empty, empty, flagBackMaterial, flagFrontMaterial]);


const boardGeometry = new THREE.BoxGeometry(80, 50, 0);
const boardFrontMaterial = new THREE.MeshBasicMaterial({map: boardFrontMap, transparent: true});
const boardBackMaterial = new THREE.MeshBasicMaterial({map: boardBackMap, transparent: true});
const board = new THREE.Mesh(boardGeometry, [empty, empty, empty, empty, boardFrontMaterial, boardBackMaterial]);

const itemBlueprints = [{
    mesh: new THREE.Mesh(new THREE.BoxGeometry(30, 30, 30),
    new THREE.MeshBasicMaterial( { map: linkedinMap } )),
    phi: -Math.PI/4,
    theta: 0,
    onclick: () => {
        window.open(LINKEDIN, "_blank");
    }
},
{
    mesh: new THREE.Mesh(new THREE.BoxGeometry(30, 30, 30),
                         new THREE.MeshBasicMaterial( { map: githubMap, emissive: true, emissiveIntensity: 100 } )),
    phi: Math.PI/4,
    theta: 0,
    onclick: () => {
        window.open(GITHUB, "_blank");
    }
},
{
    mesh: board,
    phi: -3 * Math.PI / 8,
    theta: Math.PI/2,
    bias: 10
},

{
    mesh: flag,
    phi: Math.PI/3,
    theta: Math.PI/2,
    bias: -5
},

{
    mesh: new THREE.Mesh(new THREE.BoxGeometry(30, 30, 30),
                         new THREE.MeshBasicMaterial( { map: project1Map } )),
    phi: 0.75 * Math.PI,
    theta: 0,
    onclick: () => {
        window.open(PROJECT1, "_blank");
    }
},

{
    mesh: new THREE.Mesh(new THREE.BoxGeometry(30, 30, 30),
                         new THREE.MeshBasicMaterial( { map: project2Map } )),
    phi: 1.25 * Math.PI,
    theta: 0,
    onclick: () => {
        window.open(PROJECT2, "_blank");
    }
},

{
    mesh: new THREE.Mesh(new THREE.BoxGeometry(30, 30, 30),
                         new THREE.MeshBasicMaterial( { map: project3Map } )),
    phi: Math.PI,
    theta: 0,
    onclick: () => {
        window.open(PROJECT3, "_blank");
    }
},
]

// ##############################################
// Render Items on the planet
// ##############################################

const itemMeshes = [];
const itemBeingHighlighted = [];


itemBlueprints.forEach((item) => {
    const mesh = item.mesh;
    let phi = item.phi;
    let theta = item.theta;

    scene.add(mesh);

    mesh.geometry.computeBoundingBox(); // call this first
    const bbox = mesh.geometry.boundingBox;
    const height = bbox.max.y - bbox.min.y;

    let r = PLANET_RADIUS + height / 2;

    if(item.bias) { r += item.bias }
    
    const [x,y,z] = polarToCartesian(r, theta, phi);

    mesh.position.set(x, y, z);

    mesh.lookAt(new THREE.Vector3(0, 0, 0));
    mesh.rotateX(-Math.PI/2); // so it faces up
    
    itemMeshes.push(mesh);
    itemBeingHighlighted.push(false);
}) 

// ##############################################
// Raycasting
// ##############################################

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();


export function castRay(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    return raycaster.intersectObjects(scene.children, true);
}

// ##############################################
// Highlight effect on hover
// ##############################################

window.addEventListener('mousemove', (event) => {
    const intersects = castRay(event);

    for(let i = 0; i < itemBeingHighlighted.length; i++) {
        if(itemBeingHighlighted[i]) {
            itemMeshes[i].scale.set(1.1, 1.1, 1.1);
        } else {
            itemMeshes[i].scale.set(1,1,1);
        }
        itemBeingHighlighted[i] = false;
    }  
    document.documentElement.style.cursor = "default";


    if (intersects.length > 0) {
        const obj = intersects[0].object;

        if(!itemMeshes.includes(obj)) { // only highlight items on the planet
            return;
        }

        const idx = itemMeshes.indexOf(obj); // only highlight items that have some defined action
        if(!itemBlueprints[idx].onclick) {
            return;
        }
        
        itemBeingHighlighted[idx] = true;
        document.documentElement.style.cursor = "pointer";
    }
})

// ##############################################
// Event triggering on click
// ##############################################

window.addEventListener('click', (event) => {
    const intersects = castRay(event);

    if (intersects.length > 0) {
        const obj = intersects[0].object;

        if (!itemMeshes.includes(obj)) return;

        const idx = itemMeshes.indexOf(obj); // so we can get information about the item
        const itemInfo = itemBlueprints[idx];
        
        // If we defined custom behaviour, run that here.
        if(itemInfo.onclick) {
            itemInfo.onclick();
            return;
        }
    }
})


// ##############################################
// Main Loop & Basic Resize Handling
// ##############################################

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
    updateMoonPosition();
}

window.addEventListener('resize', () => {
    camera.aspect = rootElement.clientWidth / rootElement.clientHeight;
    camera.updateProjectionMatrix();
    controls.update();
    renderer.setSize(rootElement.clientWidth, rootElement.clientHeight);
});

animate();