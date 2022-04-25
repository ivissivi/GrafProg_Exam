    import * as THREE from '/node_modules/three/src/Three.js';
    import { OrbitControls } from '/node_modules/three/examples/js/controls/OrbitControls.js';

    const bulletTexture = "/bullet.jpg";

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.3, 1000 );
    scene.add( camera );

    const light = new THREE.AmbientLight( 0x404040 );
    scene.add( light );

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor(0xffffff, 0)
    document.body.appendChild( renderer.domElement );

    const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.9 );
    scene.add( directionalLight );

    const hdr = '/geislingen_an_der_steige_1k.hdr';

    var geometry = new THREE.BoxGeometry( 1, 1, 3 );
    var material = new THREE.MeshStandardMaterial( { 
        
        color: 0xff0000,
        metalness: 1.0,
        roughness: 0.5,
        clearcoat: 1.0,
        envMap: hdr
    
    } );
    var cannonPlayer1 = new THREE.Mesh( geometry, material );
    cannonPlayer1.position.z = -5;
    scene.add( cannonPlayer1 );

    directionalLight.target = cannonPlayer1

    var geometry = new THREE.BoxGeometry( 1, 1, 3 );
    var material = new THREE.MeshStandardMaterial( { 
        
        color: 0x00ff00,
        metalness: 1.0,
        roughness: 0.5,
        clearcoat: 1.0,
        envMap: hdr
    
    } );
    var cannoncannonPlayer2 = new THREE.Mesh( geometry, material );
    cannoncannonPlayer2.position.z = 5;
    scene.add( cannoncannonPlayer2 );

    directionalLight.target = cannoncannonPlayer2

    const size = 10;
    const divisions = 10;

    const gridHelper = new THREE.GridHelper( size, divisions );
    scene.add( gridHelper );

    const controls = new OrbitControls( camera, renderer.domElement );
    controls.update();
    
    camera.position.x = 5;
    camera.position.y = 5;
    camera.position.z = -10;

    var xSpeed = 0.05;
    var ySpeed = 0.05;

    document.addEventListener("keydown", onDocumentKeyDown, false);
    function onDocumentKeyDown(event) {
        var keyCode = event.which;
        console.log(event);
        if (keyCode == 65) { //Vada player1 izmantojot WASD taustiņus
            cannonPlayer1.position.x += ySpeed;
        } else if (keyCode == 68) {
            cannonPlayer1.position.x -= ySpeed;
        } else if (keyCode == 83) {
            cannonPlayer1.position.z -= xSpeed;
        } else if (keyCode == 87) {
            cannonPlayer1.position.z += xSpeed;
        } else if (keyCode == 32) {
            cannonPlayer1.position.set(0, 0, -5); //Default pozīcijas, izmantojot spacebar
        }

        if (keyCode == 75) { //Vada cannonPlayer2 izmantojot IJKL taustiņus
            cannoncannonPlayer2.position.z += ySpeed;
        } else if (keyCode == 73) {
            cannoncannonPlayer2.position.z -= ySpeed;
        } else if (keyCode == 74) {
            cannoncannonPlayer2.position.x -= xSpeed;
        } else if (keyCode == 76) {
            cannoncannonPlayer2.position.x += xSpeed;
        } else if (keyCode == 32) {
            cannoncannonPlayer2.position.set(0, 0, 5); // Default pozīcijas, izmantojot spacebar
        }

        if (keyCode == 17) { // Tēmē uz augšu / uz leju player1 izmantojot shift un ctrl
            cannonPlayer1.rotation.x += ySpeed;
        } else if (keyCode == 16) {
            cannonPlayer1.rotation.x -= ySpeed;
        }

        if (keyCode == 90) { // Tēmē uz augšu / uz leju cannonPlayer2 izmantojot Z un X
            cannoncannonPlayer2.rotation.x += ySpeed;
        } else if (keyCode == 88) {
            cannoncannonPlayer2.rotation.x -= ySpeed;
        }
    };

    var bullets = [];
    window.addEventListener("mousedown", onMouseDown);

    function onMouseDown() { var bulletGeometry = new THREE.SphereGeometry(bulletRadius, 16, 16),
        bulletMaterial = new THREE.MeshPhongMaterial({ 
          map: new THREE.TextureLoader().load(bulletTexture),
          side: THREE.DoubleSide,
          shininess: 0,
          });
          bullet = new THREE.Mesh(bulletGeometry, bulletMaterial);
        bullet.position.copy(cannonPlayer2.getWorldPosition());
        bullet.quaternion.copy(camera.quaternion);
        scene.add(bullet);
        bullets.push(bullet);
      }
      
      var speed = 1;
      var clock = new THREE.Clock();
      var delta = 0;

    var bulletRadius = 0.3,
        bullet, 
        cannonPlayer1, 
        cannonPlayer2, 
        score = {
        attackGood: 0,
        attackBad: 0
      };

      /*function shootBullet() {
        var direction = 1;
        bullet.$velocity = {
          x: Math.random() * (50 - 20) + (-20),
          z: direction * Math.random() * (50 - 20) + 20
        };
        bullet.$stopped = false;
      }

      function bulletMovement() {
        if(!bullet.$velocity) {
            shootBullet();
        }

        if(bullet.$stopped) {
            return;
          }
          
          updateBulletPosition();

          if(didPlayerHit()) {
            hitBulletBack(cannonPlayer1);
          }

          if(didMissPlayer()) {
            handleEvent('shotBad');
          }
          
            if(didAttackPlayer()) {
            handleEvent('shotGood');
            }
        }
        
        function didMissPlayer() {
          return bullet.position.z > cannonPlayer1.position.z;
        }
        
        function didAttackPlayer() {
          return bullet.position.z < cannonPlayer2.position.z;
        }
        
        function updateBulletPosition() {
          var bulletPos = bullet.position;
          
          bulletPos.x += bullet.$velocity.x;
          bulletPos.z += bullet.$velocity.z;
          
          bulletPos.y = -((bulletPos.z - 1) * (bulletPos.z - 1) / 5000) + 450;
        }
        
        function didPlayerHit() {
          return bullet.position.z + bulletRadius >= cannonPlayer1.position.z && isBulletAlignedWithPlayer(cannonPlayer1);
        }
        
        function isBulletAlignedWithPlayer(playerObject) {
          var playerWidthDivided = 1 / 2,
              playerX = playerObject.position.x,
              BulletX = bullet.position.x;
          return BulletX > playerX - playerWidthDivided && 
              BulletX < playerX + playerWidthDivided;
        }

        function handleEvent(shot) {
            stopBullet();
            setTimeout(reset, 2000);
        }
        
        function stopBullet(){ 
          bullet.$stopped = true;
        }
    
        function reset() {
          bullet.position.set(0,0,0);
          bullet.$velocity = null;
        }*/

        var animate = function () {
        requestAnimationFrame( animate );
        //bulletMovement();
        delta = clock.getDelta();
        bullets.forEach(b => {
          b.translateZ(-speed * delta);
        });
        controls.update();

        renderer.render( scene, camera );
    };

    animate();
