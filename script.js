import * as THREE from 'three';

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0X00e600);

const geometryR = new THREE.BoxGeometry(15, 100, 1);
const materialR = new THREE.MeshBasicMaterial( { color: 0xd6d6c2 } );
const road = new THREE.Mesh( geometryR, materialR );

const loader = new GLTFLoader();

loader.load( 'path/to/model.glb', function ( gltf ) {

	scene.add( gltf.scene );

}, undefined, function ( error ) {

	console.error( error );

} );

const geometryCar = new THREE.BoxGeometry();
const materialCar = new THREE.MeshBasicMaterial( { color: 0x0000ff } );
const car = new THREE.Mesh( geometryCar, materialCar );
car.position.set(0, -10, 0);

const geometryM = new THREE.CircleGeometry( .5, 35 );
const materialM = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
const money = new THREE.Mesh( geometryM, materialM );
money.position.set(5, 5, 5);

scene.add(car);
scene.add(road);
scene.add(money);

const aspect = window.innerWidth / window.innerHeight;
const camera = new THREE.PerspectiveCamera(75,aspect,0.1,5000);
camera.position.setZ(20);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild( renderer.domElement );


function animate() {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}

animate();
