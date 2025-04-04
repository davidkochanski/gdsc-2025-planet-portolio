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
camera.position.y = 200;

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





// ##############################################
// Define items on the planet
// ##############################################

const itemBlueprints = [

]


// ##############################################
// Render Items on the planet
// ##############################################

const itemMeshes = []

itemBlueprints.forEach((item) => {
    
});


// ##############################################
// Raycasting
// ##############################################

// function castRay(event) {
//     mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
//     mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

//     raycaster.setFromCamera(mouse, camera);
//     return raycaster.intersectObjects(scene.children, true);
// }

// ##############################################
// Main Loop & Basic Resize Handling
// ##############################################

function animate() {
    requestAnimationFrame(animate)
    renderer.render( scene, camera ); 
    controls.update();
}

animate();


// window.addEventListener('resize', () => {
//     camera.aspect = rootElement.clientWidth / rootElement.clientHeight;
//     camera.updateProjectionMatrix();
//     controls.update();
//     renderer.setSize(rootElement.clientWidth, rootElement.clientHeight);
// });
