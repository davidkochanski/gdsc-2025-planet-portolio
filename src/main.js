import * as THREE from "three";
import "./style.css"
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';
import { GITHUB, LINKEDIN } from "./urls";

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





// ##############################################
// Load Textures
// ##############################################

// const loader = new THREE.TextureLoader();

// const planetMap = loader.load("planet_normal.png");

// const galaxyMap = loader.load("galaxy.png")

// const moonTextureMap = loader.load("moon_texture.jpg")
// const moonNormalMap = loader.load("moon_normal.png")

// const linkedinCube = loader.load("linkedin.png")
// const githubCube = loader.load("github.png")

// const flagFrontMap = loader.load("welcome_flag_front.png")
// const flagBackMap = loader.load("welcome_flag_back.png")


// ##############################################
// Main Planet
// ##############################################



// ##############################################
// Lighting
// ##############################################



// ##############################################
// Stars and Galaxies
// ##############################################




// ##############################################
// Skybox Background
// ##############################################


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

}

animate();


// window.addEventListener('resize', () => {
//     camera.aspect = rootElement.clientWidth / rootElement.clientHeight;
//     camera.updateProjectionMatrix();
//     controls.update();
//     renderer.setSize(rootElement.clientWidth, rootElement.clientHeight);
// });
