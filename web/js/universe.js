'use strict';

var SPREAD_FACTOR = 100;

function Universe(spaceviz, data) {

  var attributes, uniforms;

  this.init = function() {
    // Load dependencies. Right now only texture.
    new THREE.TextureLoader().load('images/cloud4.png', function(texture) {
      setup(texture);
    });
  };

  function setup(texture){
    uniforms = {
      map: {type: 't', value: texture},
    };

    var geometry = new THREE.BufferGeometry();
    var positions = new Float32Array(data.length * 3);
    var colors = new Float32Array(data.length * 3);
    var sizes = new Float32Array(data.length);

    for (var i=0, i3=0; i < data.length; i++, i3 += 3) {
      var datum = data[i];
      var name = datum[0];
      var pos = datum.slice(1, 4);

      var x = pos[0] * SPREAD_FACTOR;
      var y = pos[1] * SPREAD_FACTOR;
      var z = pos[2] * SPREAD_FACTOR;
      positions[i3 + 0] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;

      colors[i3 + 0] = 255;
      colors[i3 + 1] = 255;
      colors[i3 + 2] = 255;

      sizes[i] = 2.0
    }

    geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
    geometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );
    geometry.addAttribute( 'size', new THREE.BufferAttribute( sizes, 1 ) );

    var particle_material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: document.getElementById('vertex-shader').textContent,
      fragmentShader: document.getElementById('fragment-shader').textContent,

      depthTest: false,
      transparent : true,
      blending: THREE.AdditiveBlending
    });

    var particle_system = new THREE.Points(geometry, particle_material);
    particle_system.frustumCulled = true;
    particle_system.sortParticles = false;
    spaceviz.getScene().add(particle_system);
  }
}
