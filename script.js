import * as THREE from 'three';

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0X00e600);

const geometryR = new THREE.BoxGeometry(5, 3, 180);
const materialR = new THREE.MeshBasicMaterial( { color: 0xd6d6c2 } );
const road = new THREE.Mesh( geometryR, materialR );
road.position.setZ(-91);

const loader = new GLTFLoader();

loader.load( 'path/to/model.glb', function ( gltf ) {

	scene.add( gltf.scene );

}, undefined, function ( error ) {

	console.error( error );

} );

const geometryCar = new THREE.BoxGeometry(.5, .5, .5);
const materialCar = new THREE.MeshBasicMaterial( { color: 0x0000ff } );
const car = new THREE.Mesh( geometryCar, materialCar );
car.position.set(0, 2, -2);

const tabMoney = [];
// const geometryM = new THREE.CircleGeometry( .1, 35 );
// const materialM = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
// const money = new THREE.Mesh( geometryM, materialM );
// money.position.set(0, 2, -15);
function createMoney(){
	for(let i = 0; i < 3; i++){
		const geometryM = new THREE.CircleGeometry( .1, 35 );
		const materialM = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
		const money = new THREE.Mesh( geometryM, materialM );
		money.position.set(-1 + i, 2, -15);
		tabMoney.push(money);
	}
}
createMoney();

const tabBox = [];
function createBox(){
	for(let i = 0; i < 3; i++){
		const geometryB = new THREE.BoxGeometry(.15, .15, .15);
		const materialB = new THREE.MeshBasicMaterial( { color: 0x993300 } );
		const box = new THREE.Mesh( geometryB, materialB );
		box.position.set(-1 + i, 2, -3); 
		tabBox.push(box);
	}
}
createBox();

// const geometryB = new THREE.BoxGeometry(.1, .1, .1);
// const materialB = new THREE.MeshBasicMaterial( { color: 0x993300 } );
// const box = new THREE.Mesh( geometryB, materialB );
// box.position.set(0, 2, -3);

scene.add(car);
scene.add(road);
for(let i = 0; i < tabBox.length; i++){
	scene.add(tabBox[i]);
}

for( let i = 0; i < tabMoney.length; i++){
	scene.add(tabMoney[i]);
}

const aspect = window.innerWidth / window.innerHeight;
const camera = new THREE.PerspectiveCamera(40,aspect,.1,5000);
camera.position.set(0, 4, 1);
camera.rotateX(-0.4);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild( renderer.domElement );

let zM = -15;
let zB = -20;
function animate() {
	zM += 0.1;
	for(let i = 0; i < tabMoney.length; i++){
		tabMoney[i].position.setZ(zM);
	}

	zB += 0.1;
	for(let i = 0; i < tabMoney.length; i++){
		tabBox[i].position.setZ(zB);
	}

	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}

animate();
