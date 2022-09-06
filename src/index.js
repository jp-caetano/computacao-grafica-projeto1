
//---------------------------- IMPORTAÇÕES DO THREE.JS ----------------------------//

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CubeTextureLoader } from 'three/src/loaders/CubeTextureLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

//-------------------------- CONSTRUTOR DO RENDERER  --------------------------//

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//-------------------------- CONFIGURAÇÕES DA CÂMERA --------------------------//

const camera = new THREE.PerspectiveCamera(
	45,
	window.innerWidth / window.innerHeight,
	20,
	500
);
camera.position.set(30, 30, 0);
camera.lookAt( 0, 0, 0 );

//---------------------------- CONTRUÇÃO DA CENA ----------------------------//

const scene = new THREE.Scene();

scene.background = new CubeTextureLoader()
	.setPath('../images/universe/')
	.load([
		'posx.jpg',
		'negx.jpg',
		'posy.jpg',
		'negy.jpg',
		'posz.jpg',
		'negz.jpg'
	]);

//---------------------------- MODELAGEM DO CUBO ----------------------------//

const material_lines = new THREE.LineBasicMaterial({ color: 0xFFFFFF });

let p1, p2, p3, p4, p5, p6, p7, p8, geometry, lines;

p1 = new THREE.Vector3(-0.5, 4.5, -2);
p2 = new THREE.Vector3(-0.5, 5.5, -2);
p3 = new THREE.Vector3(0.5, 5.5, -2);
p4 = new THREE.Vector3(0.5, 4.5, -2);
p5 = new THREE.Vector3(-0.5, 4.5, -3);
p6 = new THREE.Vector3(-0.5, 5.5, -3);
p7 = new THREE.Vector3(0.5, 5.5, -3);
p8 = new THREE.Vector3(0.5, 4.5, -3);

draw ([p1,p2, p3, p4], geometry, lines, scene);
draw ([p5, p6, p7, p8], geometry, lines, scene);
draw ([p1, p5], geometry, lines, scene);
draw ([p2, p6], geometry, lines, scene);
draw ([p3, p7], geometry, lines, scene);
draw ([p4, p8], geometry, lines, scene);

//---------------------------- MODELAGEM DA LUA ----------------------------//

const texture_background = new THREE.TextureLoader().load('../textures/moon.jpg');

const geometry_sphere = new THREE.SphereGeometry( 16, 32, 16);
const material_sphere = new THREE.MeshBasicMaterial( { map: texture_background } );
const sphere = new THREE.Mesh( geometry_sphere, material_sphere );
sphere.position.y = -15.65;
scene.add( sphere );

//----------------------------- APOLLO LUNAR -----------------------------//

new RGBELoader()
	.setPath('../textures/')
	.load('royal_esplanade_1k.hdr', function (texture) {

		texture.mapping = THREE.EquirectangularReflectionMapping;
		scene.environment = texture;
		render();

		const loader = new GLTFLoader().setPath('../apollo_lunar_module/');
		loader.load('scene.gltf', function (gltf) {

			scene.add(gltf.scene);

			render();

		});

	});

//---------------------- CONTROLE ORBITAL DA CÂMERA ----------------------//

const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

//-------------------- FUNÇÕES UTILIZADAS NO PROJETO --------------------//

function render() {

	renderer.render(scene, camera);

}

function draw(points, geometry, lines, scene) {
	geometry = new THREE.BufferGeometry().setFromPoints(points);
	lines = new THREE.LineLoop(geometry, material_lines);
	scene.add(lines);
}

function animate() {

	requestAnimationFrame(animate);

	controls.update();

	render();

}

//--- EXECUÇÃO DO PROJETO ---//

animate();

