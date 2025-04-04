import * as THREE from 'three';
import "./style.css";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import {generateSphericalCoords, polarToCartesian, randomRange, randomSign, getTangentVector} from "./math"

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

const controls = new TrackballControls(camera, renderer.domElement);
controls.rotateSpeed = 3.0;
controls.zoomSpeed = 0.1;
controls.minDistance = 100;
controls.maxDistance = 1000;
controls.panSpeed = 0.8;
controls.noZoom = false;
controls.noPan = true;
controls.dynamicDampingFactor = 0.3;


const loader = new THREE.TextureLoader();

const galaxyMap = loader.load("galaxy.png");
const planetTexture = loader.load("planet_texture.jpg");
const moonTexture = loader.load("moon_texture.jpg");

const planetNormal = loader.load("planet_normal.png");
const moonNormal = loader.load("moon_normal.png");

const flagFront = loader.load("welcome_flag_front.png");
const flagBack = loader.load("welcome_flag_back.png");

const boardFront = loader.load("board_front.png");
const boardBack = loader.load("board_back.png");


const PLANET_RADIUS = 75;


const planetGeometry = new THREE.SphereGeometry(PLANET_RADIUS, 32, 32);
const planetMaterial = new THREE.MeshStandardMaterial({ color: "#DC143C", normalMap: planetNormal, emissive: true, emissiveIntensity: 1000 });
const planet = new THREE.Mesh(planetGeometry, planetMaterial);

scene.add(planet);


const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(100, 100, 100)
directionalLight.lookAt(0,0,0)

scene.add(directionalLight)


const cubeLoader = new THREE.CubeTextureLoader();
const skybox = cubeLoader.load([
  'px.jpg', 'nx.jpg',
  'py.jpg', 'ny.jpg',
  'pz.jpg', 'nz.jpg'
]);

scene.background = skybox;


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



const moonGeometry = new THREE.SphereGeometry(24, 16, 16);
const moonMaterial = new THREE.MeshStandardMaterial({ map: moonTexture, normalMap: moonNormal});
const moon = new THREE.Mesh(moonGeometry, moonMaterial);
scene.add(moon);

let moonAngle = 0;
const moonDistance = 300;

function updateMoonPosition() {
    moonAngle += Math.PI / 1200;
    const theta = moonAngle;
    const phi = Math.PI/3;
    
    const x = moonDistance * Math.sin(theta) * Math.cos(phi); 
    const y = moonDistance * Math.sin(theta) * Math.sin(phi);
    const z = moonDistance * Math.cos(theta)
    
    moon.position.set(x, y, z);
}


const flagGeometry = new THREE.BoxGeometry(50, 50, 0);

const flagFrontMaterial = new THREE.MeshToonMaterial({map: flagFront, transparent: true});
const flagBackMaterial = new THREE.MeshToonMaterial({map: flagBack, transparent: true});


const empty = new THREE.MeshToonMaterial({color: "black"})


const flag = new THREE.Mesh(flagGeometry, [  
    empty,
    empty,
    empty,
    empty,
    flagBackMaterial,
    flagFrontMaterial
]);


const boardGeometry = new THREE.BoxGeometry(80, 50, 0);

const boardFrontMaterial = new THREE.MeshToonMaterial({map: boardFront, transparent: true});
const boardBackMaterial = new THREE.MeshToonMaterial({map: boardBack, transparent: true});


const board = new THREE.Mesh(boardGeometry, [empty, empty, empty, empty, boardFrontMaterial, boardBackMaterial])

const itemBlueprints = [{
    mesh: new THREE.Mesh(new THREE.BoxGeometry(30, 30, 30),
                         new THREE.MeshToonMaterial( { map: loader.load("linkedin.png"), emissive: true, emissiveIntensity: 10} )),
    phi: -Math.PI/4,
    theta: 0,
    onclick: () => {
        window.open("https://www.linkedin.com/in/davidkochanski/", "_blank");
    }
},
{
    mesh: new THREE.Mesh(new THREE.BoxGeometry(30, 30, 30),
                         new THREE.MeshToonMaterial( { map: loader.load("github.png"), emissive: true, emissiveIntensity: 10} )),
    phi: Math.PI/4,
    theta: 0,
    onclick: () => {
        window.open("https://github.com/davidkochanski", "_blank");
    }
},
{
    mesh: board,
    phi: -3 * Math.PI / 8,
    theta: Math.PI/2

},

{
    mesh: flag,
    phi: Math.PI/3,
    theta: Math.PI/2,
    bias: -5
},
]

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

    if(item.bias) {
        r += item.bias;
    }
    
    const x = r * Math.sin(phi) * Math.cos(theta); 
    const y = r * Math.sin(phi) * Math.sin(theta);
    const z = r * Math.cos(phi);


    mesh.position.set(x, y, z);

    mesh.lookAt(new THREE.Vector3(0, 0, 0));
    mesh.rotateX(-Math.PI/2);
    
    itemMeshes.push(mesh);
    itemBeingHighlighted.push(false);
}) 




const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();


window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);


    for(let i = 0; i < itemBeingHighlighted.length; i++) {
        if(itemBeingHighlighted[i]) {
            itemMeshes[i].scale.set(1.1, 1.1, 1.1);
        } else {
            itemMeshes[i].scale.set(1,1,1);
        }
        itemBeingHighlighted[i] = false;
    }  
    document.documentElement.style.cursor = "default";
    const intersects = raycaster.intersectObjects(scene.children, true);

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


window.addEventListener('click', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(scene.children, true);

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

window.addEventListener("keydown", (event) => {
    if(event.key === "Escape") {
        resetCamera();
    }
})


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