import * as THREE from "three";
import "./style.css"
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';
import { GITHUB, LINKEDIN } from "./urls";
import { generatePolarCoords, polarToCartesian, randomRange } from "./math";

// ##############################################
// Initial Setup
// ##############################################

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 10000);
camera.up.set(0,0,1);

const cameraDistance = 200;
const cameraTheta = 1.5 * Math.PI;
const cameraPhi = 0.1 * Math.PI;

const [ix, iy, iz] = polarToCartesian(cameraDistance, cameraTheta, cameraPhi)
camera.position.set(ix,iy,iz);


const rootElement = document.getElementById("space");

const renderer = new THREE.WebGLRenderer();
renderer.setSize(rootElement.clientWidth, rootElement.clientHeight);
rootElement.appendChild(renderer.domElement);


// ##############################################
// Trackball Controls (Interactive camera)
// ##############################################

const controls = new TrackballControls(camera, renderer.domElement);
controls.noPan = true;
controls.rotateSpeed = 3;
controls.minDistance = 100;



// ##############################################
// Load Textures
// ##############################################

const loader = new THREE.TextureLoader();

const planetMap = loader.load("planet_normal.png");

const galaxyMap = loader.load("galaxy.png")

const moonTextureMap = loader.load("moon_texture.jpg")
const moonNormalMap = loader.load("moon_normal.png")

const linkedinCube = loader.load("linkedin.png")
const githubCube = loader.load("github.png")

const flagFrontMap = loader.load("welcome_flag_front.png")
const flagBackMap = loader.load("welcome_flag_back.png")

const boardFrontMap = loader.load("board_front.png")
const boardBackMap = loader.load("board_back.png")


// ##############################################
// Main Planet
// ##############################################

const PLANET_RADIUS = 75;

const planetGeometry = new THREE.SphereGeometry(PLANET_RADIUS, 32, 32);
const planetMaterial = new THREE.MeshStandardMaterial( {color: "red", normalMap: planetMap } );

const planet = new THREE.Mesh(planetGeometry, planetMaterial);

scene.add(planet);


// ##############################################
// Lighting
// ##############################################


const directionalLight = new THREE.DirectionalLight("#ffffff", 2);
directionalLight.position.set(100, 100, 100);
directionalLight.lookAt(0,0,0);

scene.add(directionalLight);



// ##############################################
// Stars and Galaxies
// ##############################################

const numStars = 1000;

for(let i = 0; i < numStars; i++) {
    let obj;

    if(Math.random() < 0.05) {
        const galaxyGeometry = new THREE.PlaneGeometry(50, 50);
        const galaxyMaterial = new THREE.MeshBasicMaterial(
            {
                map: galaxyMap
            }
        )

        obj = new THREE.Mesh(galaxyGeometry, galaxyMaterial)

    } else {
        const starGeometry = new THREE.SphereGeometry(5);
        const starMaterial = new THREE.MeshBasicMaterial( {color: "white"} )
    
        obj = new THREE.Mesh(starGeometry, starMaterial);
    }



    const [rho, theta, phi] = generatePolarCoords(1000, 8000);

    const [x,y,z] = polarToCartesian(rho, theta, phi);

    obj.position.set(x,y,z);
    obj.lookAt(0,0,0)

    scene.add(obj)

}



// ##############################################
// Skybox Background
// ##############################################

const cubeLoader = new THREE.CubeTextureLoader();
const cube = cubeLoader.load(["px.jpg", "nx.jpg", "py.jpg", "ny.jpg", "pz.jpg", "nz.jpg"])
scene.background = cube;



// ##############################################
// Moon
// ##############################################

const MOON_DISTANCE = 250;
const MOON_SIZE = 24;
const MOON_STEP = Math.PI / 600;
const MOON_TILT = Math.PI / 3;

const moonGeometry = new THREE.SphereGeometry(MOON_SIZE, 16, 16);
const moonMaterial = new THREE.MeshStandardMaterial( {map: moonTextureMap, normalMap: moonNormalMap} )

const moon = new THREE.Mesh(moonGeometry, moonMaterial);

scene.add(moon);

let moonTheta = 0;

function updateMoon() {
    moonTheta += MOON_STEP;
    const theta = moonTheta;
    const phi = MOON_TILT;
    const rho = MOON_DISTANCE;

    const [x,y,z] = polarToCartesian(rho, theta, phi)

    moon.position.set(x,y,z);
}

// ##############################################
// Define items on the planet
// ##############################################

const linkedinMesh = new THREE.Mesh(
    new THREE.BoxGeometry(30,30,30),
    new THREE.MeshBasicMaterial( {map: linkedinCube} )
)

const githubMesh = new THREE.Mesh(
    new THREE.BoxGeometry(30,30,30),
    new THREE.MeshBasicMaterial( {map: githubCube} )
)

const empty = new THREE.MeshToonMaterial({color: "black"})
const boardGeometry = new THREE.BoxGeometry(80, 50, 0);
const boardFrontMaterial = new THREE.MeshBasicMaterial({map: boardFrontMap, transparent: true});
const boardBackMaterial = new THREE.MeshBasicMaterial({map: boardBackMap, transparent: true});
const board = new THREE.Mesh(boardGeometry, [empty, empty, empty, empty,  boardBackMaterial, boardFrontMaterial]);
// {
//   mesh: ...
//   theta: ...
//   phi: ...
//   onclick: ...
//}


const itemBlueprints = [
    {
        mesh: linkedinMesh,
        phi: 0.25 * Math.PI,
        theta: 0,
        onclick: () => {
            window.open(LINKEDIN, "_blank")
        }
    },
    {
        mesh: githubMesh,
        phi: -0.25 * Math.PI,
        theta: 0,
        onclick: () => {
            window.open(GITHUB, "_blank")
        }
    },

    {
        mesh: board,
        phi: 0.33 * Math.PI,
        theta: 0.5 * Math.PI,
        onclick: () => {
            window.open(GITHUB, "_blank")
        }
    },
]


// ##############################################
// Render Items on the planet
// ##############################################

const itemMeshes = []

itemBlueprints.forEach((item) => {
    const mesh = item.mesh;
    const phi = item.phi;
    const theta = item.theta;

    mesh.geometry.computeBoundingBox();
    const bbox = mesh.geometry.boundingBox;
    const height = bbox.max.y - bbox.min.y;

    const rho = PLANET_RADIUS + height / 2;
    

    scene.add(mesh);

    const [x,y,z] = polarToCartesian(rho, theta, phi);
    mesh.position.set(x,y,z);

    mesh.lookAt(0,0,0)
    mesh.rotateX(-Math.PI/2);

    itemMeshes.push(mesh);
});


// ##############################################
// Raycasting
// ##############################################

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();


function castRay(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    return raycaster.intersectObjects(scene.children, true);
}

window.addEventListener("click", (event) => {
    const intersects = castRay(event);

    if(intersects.length == 0) {
        return;
    }

    const obj = intersects[0].object;

    if(!itemMeshes.includes(obj)) {
        return;
    }

    const idx = itemMeshes.indexOf(obj);
    const itemInfo = itemBlueprints[idx];

    if(itemInfo.onclick) {
        itemInfo.onclick()
    }
})



// ##############################################
// Main Loop & Basic Resize Handling
// ##############################################

function animate() {
    requestAnimationFrame(animate)
    renderer.render( scene, camera ); 
    controls.update();
    updateMoon();
}

animate();


window.addEventListener('resize', () => {
    camera.aspect = rootElement.clientWidth / rootElement.clientHeight;
    camera.updateProjectionMatrix();
    controls.update();
    renderer.setSize(rootElement.clientWidth, rootElement.clientHeight);
});
