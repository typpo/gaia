'use strict';

function GenericSpaceViz(containerId) {

  var WEB_GL_ENABLED = true;

  var stats, scene, renderer, composer, renderTarget, projector;
  var camera, cameraControls;
  var using_webgl = false;
  var camera_fly_around = true;
  var object_movement_on = true;

  this.init = function() {
    window.requestAnimFrame = (function() {
      return window.requestAnimationFrame       ||
             window.webkitRequestAnimationFrame ||
             window.mozRequestAnimationFrame    ||
             window.oRequestAnimationFrame      ||
             window.msRequestAnimationFrame     ||
             function( callback ){
               window.setTimeout(callback, 1000 / 60);
             };
    })();

    if (WEB_GL_ENABLED && Detector.webgl) {
      renderer = new THREE.WebGLRenderer({
        antialias: true
      });
      renderer.setClearColor(0x000000, 1);
      using_webgl = true;
    } else {
      alert('Sorry, your browser does not support webgl, a requirement for this visualization.');
      return;
    }
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderTarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, {
      //minFilter: THREE.LinearFilter,
      //magFilter: THREE.LinearFilter,
      //format: THREE.RGBFormat,
      stencilBuffer: false
    });

    document.getElementById(containerId).appendChild(renderer.domElement);

    // create a scene
    scene = new THREE.Scene();

    // put a camera in the scene
    var cameraH	= 3;
    var cameraW	= cameraH / window.innerHeight * window.innerWidth;
    window.camera = camera = new THREE.PerspectiveCamera(
        75, window.innerWidth / window.innerHeight, 1, 5000);
    camera.position.set(592, 600, 983)
    camera.center = new THREE.Vector3(0, 0, 0);

    scene.add(camera);

    window.cc = cameraControls = new THREE.OrbitControls(camera);
    cameraControls.maxDistance = 2700;
    cameraControls.autoRotate = true;
    cameraControls.autoRotateSpeed = 0.3;

    // Rendering stuff
    window.renderer = renderer;
  };

  this.getScene = function() {
    return scene;
  };

  this.getControls = function() {
    return cameraControls;
  };

  this.start = function() {
    animate();
  };

  // animation loop
  function animate() {
    render();
    requestAnimFrame(animate);
  }

  // render the scene
  function render() {
    // update camera controls
    cameraControls.update();
    // actually render the scene
    renderer.render(scene, camera);
  }
}
