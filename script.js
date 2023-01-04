import * as THREE from 'three';

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

	// create the scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0X00e600);

	// create the road
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

	// create the car
const geometryCar = new THREE.BoxGeometry(.5, .5, .5);
const materialCar = new THREE.MeshBasicMaterial( { color: 0x0000ff } );
const car = new THREE.Mesh( geometryCar, materialCar );
car.position.set(0, 2, -2);


	// the function which will create the money
const tabMoney = [];
let z_initialM = [], z_initialB = [];
// const geometryM = new THREE.CircleGeometry( .1, 35 );
// const materialM = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
// const money = new THREE.Mesh( geometryM, materialM );
// money.position.set(0, 2, -15);
function createMoney(positionX, positionZ, nombreCreation, toChange){
	for(let i = 0; i < nombreCreation; i++){
		const geometryM = new THREE.CircleGeometry( .1, 35 );
		const materialM = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
		const money = new THREE.Mesh( geometryM, materialM );
		money.position.set(positionX, 2, positionZ);
		if (toChange === 'x'){
			money.position.setX(i);
		}else if(toChange === 'z'){
			money.position.setZ(positionZ - i);
		}
		tabMoney.push(money);
		z_initialM.push(money.position.z);
	}
}
createMoney(-1, -15, 3, 'z');
createMoney(0, -15, 2, 'x');
createMoney(1.5, -15, 2, 'z');
createMoney(0, -20, 2, 'z');

	// the function which will create the boxes
const tabBox = [];
// const geometryB = new THREE.BoxGeometry(.1, .1, .1);
// const materialB = new THREE.MeshBasicMaterial( { color: 0x993300 } );
// const box = new THREE.Mesh( geometryB, materialB );
// box.position.set(0, 2, -3);
function createBox(x, y, z){
	const geometryB = new THREE.BoxGeometry(.15, .15, .15);
	const materialB = new THREE.MeshBasicMaterial( { color: 0x993300 } );
	const box = new THREE.Mesh( geometryB, materialB );
	box.position.set(x, y, z); 
	tabBox.push(box);
	z_initialB.push(box.position.z);
}
createBox(0, 2, -20);
createBox(1, 2, -30);
createBox(-1, 2, -25);

	// add the obejcts to the scene
scene.add(car);
scene.add(road);
for(let i = 0; i < tabBox.length; i++){
	scene.add(tabBox[i]);
}
for( let i = 0; i < tabMoney.length; i++){
	scene.add(tabMoney[i]);	
}

	// create the camera
const aspect = window.innerWidth / window.innerHeight;
const camera = new THREE.PerspectiveCamera(40,aspect,.1,5000);
camera.position.set(0, 4, 1);
camera.rotateX(-0.4);

	// create the renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild( renderer.domElement );

const score_conteneur = document.createElement('div');
score_conteneur.id = 'score';
score_conteneur.innerHTML = `<span>SCORE </span>
							 <span> 0</span>`

document.body.appendChild(score_conteneur);

function player(){
	document.addEventListener('keydown', (event) =>{
		if(['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)){
			switch(event.key){
				case 'ArrowRight' : 
					if(car.position.x > 1.7){
						break;
					}
					car.position.x += .1;
					break;	

				case 'ArrowLeft' : 
					if(car.position.x < -1.7){
						break;
					}
					car.position.x -= .1;
					break;
			}
		}
	});
}
player();

function animate() {
	for(let i = 0; i < tabMoney.length; i++){
		if(tabMoney[i].position.z >= -1.6){
			tabMoney[i].position.z = z_initialM[i];
			break;
		}
		tabMoney[i].position.z += 0.1
	}

	for(let i = 0; i < tabBox.length; i++){
		if(tabBox[i].position.z >= -1.6){
			tabBox[i].position.z = z_initialB[i];
			break;
		}
		tabBox[i].position.z += 0.1
	}

	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}
animate();
