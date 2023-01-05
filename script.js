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
car.position.set(0, 2, -4);
// let boundingBox = new THREE.Box3().setFromObject(car),
//     size = boundingBox.getSize();
// console.log(size);


	// the function which will create the money
const tabMoney = [];
let z_initialM = [];
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
let z_initialB = [];
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
camera.position.set(0, 5, 1);
camera.rotateX(-0.4);

	// create the renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild( renderer.domElement );

let score = document.getElementById('nb').innerHTML;
score = parseInt(score);
console.log(score);

function player(){
	document.addEventListener('keydown', (event) =>{
		if(['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)){
			switch(event.key){
				case 'ArrowRight' : 
					if(car.position.x > 2){
						car.position.y = 0;
						alert('you lose the game');
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

// function detectionCollision(){
// 	for(let j = 0; j < tabMoney.length; j++){
// 		money = tabMoney[j];
// 		if((money.position.x > car.position.x) && (money.position.x < (car.position.x + car.largeur)) ){
// 			if((money.position.y > car.position.y ) && (money.position.x < (car.position.x + car.hauteur)) ){
// 				score_content += 5;
// 				score.innerHTML = score_content;
// 			}
// 		}
// 	}

// 	for(j = 0; j < tabBox.length; j++){
// 		box = tabBox[j];
// 		if((box.position.x > car.position.x) && (box.position.x < (car.position.x + car.largeur)) ){
// 			if((box.position.y > car.position.y ) && (box.position.x < (car.position.x + car.hauteur)) ){
// 				alert('you lose the game');
// 				car.position.y = 0;
// 				break;
// 			}
// 		}
// 	}
// }

function animate() {
	for(let i = 0; i < tabMoney.length; i++){
		if(tabMoney[i].position.z >= -2.2){
			tabMoney[i].position.z = z_initialM[i];
			break;
		}
		tabMoney[i].position.z += 0.1
	}

	for(let i = 0; i < tabBox.length; i++){
		if(tabBox[i].position.z >= -2.2){
			tabBox[i].position.z = z_initialB[i];
			break;
		}
		tabBox[i].position.z += 0.1
	}

	requestAnimationFrame( animate );
	// detectionCollision();
	renderer.render( scene, camera );
}
animate();






