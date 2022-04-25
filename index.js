    import * as THREE from '/node_modules/three/src/Three.js';
    import { OrbitControls } from '/node_modules/three/examples/js/controls/OrbitControls.js';
    import { GLTFLoader } from '/GLTFLoader.js'

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
    scene.add( camera );


    var renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor(0xffffff, 0)
    document.body.appendChild( renderer.domElement );

    var geometry = new THREE.BoxGeometry( 1, 1, 1 );
    var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    var cube = new THREE.Mesh( geometry, material );
    scene.add( cube );

    const loader = new GLTFLoader();

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath( '/examples/js/libs/draco/' );
    loader.setDRACOLoader( dracoLoader );

    // Load a glTF resource
    loader.load(
	// resource URL
	'models/gltf/duck/duck.gltf',
	// called when the resource is loaded
        function ( gltf ) {

            scene.add( gltf.scene );

            gltf.animations; // Array<THREE.AnimationClip>
            gltf.scene; // THREE.Group
            gltf.scenes; // Array<THREE.Group>
            gltf.cameras; // Array<THREE.Camera>
            gltf.asset; // Object

        },
        // called while loading is progressing
        function ( xhr ) {

            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

        },
        // called when loading has errors
        function ( error ) {

            console.log( 'An error happened' );

        }
    );

    const size = 10;
    const divisions = 10;

    const gridHelper = new THREE.GridHelper( size, divisions );
    scene.add( gridHelper );

    const controls = new OrbitControls( camera, renderer.domElement );
    controls.update();
    
    camera.position.z = 5;

    var xSpeed = 0.01;
    var ySpeed = 0.01;

    document.addEventListener("keydown", onDocumentKeyDown, false);
    function onDocumentKeyDown(event) {
        var keyCode = event.which;
        console.log(event);
        if (keyCode == 87) {
            cube.position.y += ySpeed;
        } else if (keyCode == 83) {
            cube.position.y -= ySpeed;
        } else if (keyCode == 65) {
            cube.position.x -= xSpeed;
        } else if (keyCode == 68) {
            cube.position.x += xSpeed;
        } else if (keyCode == 32) {
            cube.position.set(0, 0, 0);
        }
    };
        var animate = function () {
        requestAnimationFrame( animate );

        controls.update();

        renderer.render( scene, camera );
    };

    animate();
