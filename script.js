import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { PMREMGenerator } from 'three';

let lastScore;

	// create the renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild( renderer.domElement );

	// create the scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0X00e600);

	// pour que la voiture ne soit pas en noir (enlever l'ombre)
const pmremGenerator = new THREE.PMREMGenerator(renderer);
scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;

	// create the road
const geometryR = new THREE.BoxGeometry(5, 3, 180);
const materialR = new THREE.MeshBasicMaterial( { color: 0xd6d6c2 } );
const road = new THREE.Mesh( geometryR, materialR );
road.position.setZ(-91);

	//create the car
let car;
const loader = new GLTFLoader();
loader.load( './karmann-boano.glb', function ( gltf ) {
	car = gltf.scene;
	car.position.set(0, 2, -4);
	car.scale.set(.5, .5, .5);
	car.rotation.set(0, 3.15, 0);
	scene.add( car );
}, undefined, function ( error ) {
	console.error( error );
} );

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

let score = document.getElementById('nb').innerHTML;
score = parseInt(score);

function player(){
	document.addEventListener('keydown', (event) =>{
		if(['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)){
			switch(event.key){
				case 'ArrowRight' : 
					if(car.position.x > 2){
						car.position.y = 0;
						sessionStorage.setItem('lastScore', score);
						document.getElementById('lose').style.display = 'block';
						cancelAnimationFrame(requestId);
						break;
					}
					car.position.x += .1;
					break;	

				case 'ArrowLeft' : 
					if(car.position.x < -1.7){
						car.position.y = 0;
						sessionStorage.setItem('lastScore', score);
						document.getElementById('lose').style.display = 'block';
						cancelAnimationFrame(requestId);
						break;
					}
					car.position.x -= .1;
					break;
			}
		}
	});
}
player();

function detectionCollision(tabBox, tabMoney, car){
	for(let j = 0; j < tabMoney.length; j++){
		let money = tabMoney[j];
		if((money.position.z > (car.position.z - 0.1)) && (money.position.z < (car.position.z + .1))){
			if((money.position.y > (car.position.y - 0.5) ) && (money.position.y < (car.position.y + .5)) ){
				if((money.position.x > (car.position.x - 0.5) ) && (money.position.x < (car.position.x + .5)) ){
					score += 5;
					document.getElementById('nb').innerHTML = score;
					money.position.z = z_initialM[j];
				}	
			}
		}
	}

	for(let t = 0; t < tabBox.length; t++){
		let box = tabBox[t];
		if((box.position.z > (car.position.z - 0.1)) && (box.position.z < (car.position.z + .1))){
			if((box.position.y > (car.position.y - 0.5) ) && (box.position.y < (car.position.y + .5)) ){
				if((box.position.x > (car.position.x - 0.5) ) && (box.position.x < (car.position.x + .5)) ){
					sessionStorage.setItem('lastScore', score);
					document.getElementById('lose').style.display = 'block';
					cancelAnimationFrame(requestId);
					car.position.y = 0;
					break;
				}
			}
		}
	}
}

let restart = document.getElementById('restart');
restart.addEventListener('click', (e) =>{
	document.getElementById('lose').style.display = 'none';
	car.position.y = 2;
	animate();
	lastScore = sessionStorage.getItem('lastScore');
	let bestScore = parseInt(document.getElementById('best').innerHTML);
	if(lastScore > bestScore){
		document.getElementById('best').innerHTML = lastScore;
	}
	score = 0;
	document.getElementById('nb').innerHTML = 0;
})

let requestId;
function animate() {
	for(let i = 0; i < tabMoney.length; i++){
		if(tabMoney[i].position.z >= -2.2){
			tabMoney[i].position.z = z_initialM[i];
			break;
		}
		
		if(score < 50){
			tabMoney[i].position.z += 0.1
		} else if(score < 100){
			tabMoney[i].position.z += 0.13
		}else if(score < 150){
			tabMoney[i].position.z += 0.17
		}
		
	}

	for(let i = 0; i < tabBox.length; i++){
		if(tabBox[i].position.z >= -2.2){
			tabBox[i].position.z = z_initialB[i];
			break;
		}

		if(score < 50){
			tabBox[i].position.z += 0.1
		} else if(score < 100){
			tabBox[i].position.z += 0.13
		}else if(score < 150){
			tabBox[i].position.z += 0.17
		}
		
	}

	requestId = requestAnimationFrame( animate );
	detectionCollision(tabBox, tabMoney, car);
	renderer.render( scene, camera );
}

document.getElementById('start').addEventListener('click', (e) =>{
	document.getElementById('rules').style.display = 'none';
	document.getElementById('score').style.display = 'block';
	document.getElementById('bestScore').style.display = 'block';

	animate();
})






