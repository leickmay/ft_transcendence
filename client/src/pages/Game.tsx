import React, { useEffect, Suspense, useState } from 'react';
import Navigation from '../components/Navigation';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../redux/actions/users.actions';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js';
//import urlFloortexture from '../assets/textures/floor/floor1.png'

const Game = () => {
	const dispatch = useDispatch();
	const user = useSelector((state: any) => state.userReducer);
	//const users = useSelector((state: any) => state.usersReducer);
	const elem = document.getElementById('game');
	const [pos, setPos] = useState([0, 2, 0]);	
	/*var loader = new THREE.TextureLoader();
    var texture = loader.load( urlFloortexture );*/
	var skybox: any;
	var ball: any;
	var stars: any;
	var ship: any;

	//SCENE
	const scene = new THREE.Scene();
	scene.background = new THREE.Color(0xa8def0);	

	//CAMERA
	const cam = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
	cam.position.x = 0;
	cam.position.y = 20;
	cam.position.z = 72;
	cam.rotation.x = 5.8;
	cam.rotation.y = 0;
	cam.rotation.z = 0;

	//RENDERER
	const renderer = new THREE.WebGLRenderer({ antialias: true });
	//if (elem)
	//	renderer.setSize(elem.offsetWidth - 5, elem.offsetHeight - 5);
	renderer.setSize( (window.innerWidth * 90 / 100) - 20, 795);
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.shadowMap.enabled = true;

	//CONTROLS ORBITS (For DEV)
	const orbitControls = new OrbitControls(cam, renderer.domElement);
	//orbitControls.enableDamping = true;
	//orbitControls.minDistance = 5;
	//orbitControls.maxDistance = 15;
	//orbitControls.enablePan = false;
	//orbitControls.maxPolarAngle = Math.PI / 2 - 0.05;
	orbitControls.update();

	//CONTROLS SHIP
	var left: boolean, right: boolean = false;

	//LIGHT
	light();
	// PLANE
	generateFloor();

	/*new GLTFLoader().load('http://localhost:3000/assets/models/Soldier.glb', function (gltf) {
		const model = gltf.scene;
		model.traverse(function (object: any) {
			if (object.isMesh) object.castShadow = true;
		});
		scene.add(model);	
		const gltfAnimations: THREE.AnimationClip[] = gltf.animations;
		const mixer = new THREE.AnimationMixer(model);
		const animationsMap: Map<string, THREE.AnimationAction> = new Map()
		gltfAnimations.filter(a => a.name != 'TPose').forEach((a: THREE.AnimationClip) => {
			animationsMap.set(a.name, mixer.clipAction(a))
		})
	});*/	
	function _onKeyDown(e: any) {
		switch (e.keyCode) {
			case 87: // w
				//console.log("w");
				//ball.position.z -= 0.1;
				break;
			case 65: // a
				//console.log("a");
				left = true;
				//ball.position.x -= 0.1;
				break;
			case 83: // s
				//console.log("s");
				//ball.position.z += 0.1;
				break;
			case 68: // d
				//console.log("d");
				right = true;
				//ball.position.x += 0.1;
				break;
		//case 38: // up
		//case 37: // left
		//case 40: // down
		//case 39: // right
		//break;
		}
	}

	function _onKeyUp(e: any) {
		switch (e.keyCode) {
			case 87: // w
				//console.log("w");
				break;
			case 65: // a
				//console.log("a");
				left = false;
				break;
			case 83: // s
				//console.log("s");
				break;
			case 68: // d
				//console.log("d");
				right = false;
				break;
		//case 38: // up
		//case 37: // left
		//case 40: // down
		//case 39: // right
		//break;
		}
	}

	function createPathStrings(filename: string) {
		const basePath = "http://localhost:3000/assets/Skybox/";
		const baseFilename = basePath + filename;
		const fileType = ".png";
		const sides = ["front", "back", "up", "down", "right", "left"];
		const pathStings = sides.map(side => {
		  return baseFilename + "_" + side + fileType;
		});
		return pathStings;
	}
	function createMaterialArray(filename: string) {
		const skyboxImagepaths = createPathStrings(filename);
		const materialArray = skyboxImagepaths.map(image => {
		  let texture = new THREE.TextureLoader().load(image);
		  return new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide });
		});
		return materialArray;
	}
	new GLTFLoader().load('http://localhost:3000/assets/models/Stars/scene.gltf', function ( gltf ) {
		stars = gltf.scene;
		stars.translateY(-400);
		stars.translateX(-450);
		stars.translateZ(450);
		stars.scale.set(300, 300, 300);
		//stars.size *= 10;
		stars.traverse((c: any) => {
			c.castShadow = true;
		});
		scene.add( stars );
		const materialArray = createMaterialArray("space");
		var skyboxGeo = new THREE.BoxGeometry(500, 500, 500);
		skybox = new THREE.Mesh(skyboxGeo, materialArray);
		scene.add(skybox);
	} );

	new GLTFLoader().load('http://localhost:3000/assets/models/Ball3/scene.gltf', function ( gltf ) {
		ball = gltf.scene;
		ball.translateY(1);
		ball.traverse((c: any) => {
			c.castShadow = true;
		});
		scene.add( ball );
	} );

	new GLTFLoader().load('http://localhost:3000/assets/models/Ship/scene.gltf', function ( gltf ) {
		ship = gltf.scene;
		ship.translateY(3);
		ship.translateX(0);
		ship.translateZ(55);
		ship.rotateY(3.14);
		ship.scale.set(0.6, 0.6, 0.6);
		ship.traverse((c: any) => {
			c.castShadow = true;
		});
		scene.add( ship );
	} );

	function updateShip() {
		var speedShip: number = 0.5;
		if (left)
		{
			ship.position.x -= speedShip;
			cam.position.x -= speedShip;
			if (ship.rotation.z * -1 < 3.34)
				ship.rotation.z -= 0.1;
		}
		else if (right)
		{
			ship.position.x += speedShip;
			cam.position.x += speedShip;
			if (ship.rotation.z * -1 > 2.94)
				ship.rotation.z += 0.1;
		}
		else
		{
			//if (ship.rotation.z > 3.145)
			//	ship.rotation.z -= 0.1;
			//else if (ship.rotation.z < 3.135)
			//	ship.rotation.z += 0.1;
			//console.log(ship.rotation.z);
		}
	};

	/*function updateBall() {
		if (ball.position.y <= 1)
			setBallState(0);
		if (ballState === 0)
			ball.position.y += 0.1;
		if (ball.position.y >= 5)
			setBallState(1);
		if (ballState === 1)
			ball.position.y -= 0.1;
		console.log(ball.position.y);
	};*/

	var ballState = 0;
	function animate() {

		requestAnimationFrame(animate);
		if (skybox) {
			skybox.rotation.x += 0.0001;
			skybox.rotation.y += 0.0001;
		}
		if (stars)
		{
			stars.rotation.x -= 0.00001;
			stars.rotation.y -= 0.00001;
			//stars.rotation.z -= 0.001;
		}
		if (ball)
		{
			var y = ball.position.y;
			ball.rotation.y += 0.05;
			ball.rotation.x += 0.05;
			//ball.position.y += 0.01;
			if (y < 1 && ballState === 1)
				ballState = 0;
			else if (y > 5 && ballState === 0)
				ballState = 1;
			if (ballState === 0)
				ball.position.y += 0.1;
			else if (ballState === 1)
				ball.position.y -= 0.1;
			//console.log(y + " " + ballState);
		}
		if (ship)
		{
			updateShip();
		}
		renderer.render(scene, cam);
	};
	function _OnWindowResize() {
		cam.aspect = window.innerWidth / window.innerHeight;
		cam.updateProjectionMatrix();
		renderer.setSize( (window.innerWidth * 90 / 100) - 20, 795);
	}

	useEffect(() => {
		//setInterval(function() { console.log(ball.position.y); }, 1000);
		//renderer.dispose();
		window.addEventListener("beforeunload", function() {dispatch(updateUser(user.id, {online: false}));});
		window.addEventListener('resize', () => { _OnWindowResize(); }, false);
		document.addEventListener('keydown', (e) => _onKeyDown(e), false);
		document.addEventListener('keyup', (e) => _onKeyUp(e), false);
		console.log("game reload");
		document.getElementById('game')?.appendChild(renderer.domElement);;
		//renderer.setSize(document.getElementById('game')?.offsetWidth - 5, document.getElementById('game')?.offsetHeight - 5);
		//if (elem)
		//	elem.appendChild(renderer.domElement);
	});
	animate();

	function generateFloor() {
		// TEXTURES
		const textureLoader = new THREE.TextureLoader();
		//const placeholder = textureLoader.load(urlFloortexture);
		const sandBaseColor = textureLoader.load("./assets/textures/sand/Sand 002_COLOR.jpg");
		const sandNormalMap = textureLoader.load("./assets/textures/sand/Sand 002_NRM.jpg");
		const sandHeightMap = textureLoader.load("./assets/textures/sand/Sand 002_DISP.jpg");
		const sandAmbientOcclusion = textureLoader.load("./textures/sand/Sand 002_OCC.jpg");	
		const WIDTH = 4
		const LENGTH = 8
		const NUM_X = 15
		const NUM_Z = 15	
		const geometry = new THREE.PlaneGeometry(WIDTH, LENGTH, 512, 512);
		/*const material = new THREE.MeshStandardMaterial(
			{
				map: sandBaseColor, normalMap: sandNormalMap,
				displacementMap: sandHeightMap, displacementScale: 0.1,
				aoMap: sandAmbientOcclusion
			})*/
		//const material1 = new THREE.MeshPhongMaterial({ map: placeholder })	
		const material2 = new THREE.MeshStandardMaterial( { color: 0x808080, roughness: 0.1, metalness: 0 } );
		for (let i = 0; i < NUM_X; i++) {
			for (let j = 0; j < NUM_Z; j++) {
				const floor = new THREE.Mesh(geometry, material2)
				floor.receiveShadow = true
				floor.rotation.x = - Math.PI / 2	
				floor.position.x = i * WIDTH - (NUM_X / 2) * WIDTH
				floor.position.z = j * LENGTH - (NUM_Z / 2) * LENGTH	
				scene.add(floor)
			}
		}
	}	
	function light() {
		//scene.add(new THREE.AmbientLight(0xffffff, 0.7))	
		const dirLight = new THREE.DirectionalLight(0xffffff, 1)
		dirLight.position.set(- 60, 100, - 10);
		dirLight.castShadow = true;
		dirLight.shadow.camera.top = 50;
		dirLight.shadow.camera.bottom = - 50;
		dirLight.shadow.camera.left = - 50;
		dirLight.shadow.camera.right = 50;
		dirLight.shadow.camera.near = 0.1;
		dirLight.shadow.camera.far = 200;
		dirLight.shadow.mapSize.width = 4096;
		dirLight.shadow.mapSize.height = 4096;
		scene.add(dirLight);

		//scene.add( new THREE.CameraHelper(dirLight.shadow.camera))

		const rect = new THREE.BoxGeometry(5, 10, 50);
		const sphere = new THREE.SphereGeometry( 0.5, 16, 8 );
		var light1 = new THREE.PointLight( 0xff0040, 2, 100 );
		light1.translateY(5);
		light1.add( new THREE.Mesh( rect, new THREE.MeshBasicMaterial( { color: 0xff0040 } ) ) );
		//scene.add( light1 );

		RectAreaLightUniformsLib.init();
		const rectLight1 = new THREE.RectAreaLight( 0x8100D8, 5, 60, 10 );
		rectLight1.position.set( -2.3, 5, 55 );
		scene.add( rectLight1 );

		const rectLight2 = new THREE.RectAreaLight( 0x8100D8, 5, 60, 10 );
		rectLight2.position.set( -2.3, 5, -62 );
		rectLight2.rotateY(3.15);
		scene.add( rectLight2 );

		const rectLight3 = new THREE.RectAreaLight( 0x8100D8, 5, 118, 10 );
		rectLight3.position.set( 27.5, 5, -3.5 );
		rectLight3.rotateY(1.57);
		scene.add( rectLight3 );

		const rectLight4 = new THREE.RectAreaLight( 0x8100D8, 5, 118, 10 );
		rectLight4.position.set( -32, 5, -3.5 );
		rectLight4.rotateY(-1.57);
		scene.add( rectLight4 );

		//scene.add( new RectAreaLightHelper( rectLight1 ) );
		//scene.add( new RectAreaLightHelper( rectLight2 ) );
		//scene.add( new RectAreaLightHelper( rectLight3 ) );
		//scene.add( new RectAreaLightHelper( rectLight4 ) );
	}
	return (
		<div>
			<Navigation userCard={user}/>
			<div id='game' className='game' />
		</div>
	);
};

export default Game;