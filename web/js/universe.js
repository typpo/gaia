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
    var particles = new THREE.Geometry();

    attributes = {
      size: {type: 'f', value: []},
      r: {type: 'f', value: []},
      g: {type: 'f', value: []},
      b: {type: 'f', value: []},
      pos: {type: 'v3', value: []}
    };

    uniforms = {
      map: {type: 't', value: texture},
    };

    for (var i=0; i < data.length; i++) {
      var datum = data[i];
      var name = datum[0];
      var pos = datum.slice(1, 4);

      var x = pos[0] * SPREAD_FACTOR;
      var y = pos[1] * SPREAD_FACTOR;
      var z = pos[2] * SPREAD_FACTOR;

      var point = new THREE.Vector3(x, y, z);
      attributes.pos.value[i] = pos;

      var size = 2.0
      attributes.size.value[i] = size;

      attributes.r.value[i] = 100;
      attributes.g.value[i] = 255;
      attributes.b.value[i] = 100;

      // add to mesh
      particles.vertices.push(point);
    }

    var particle_material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      attributes: attributes,
      vertexShader: document.getElementById('vertex-shader').textContent,
      fragmentShader: document.getElementById('fragment-shader').textContent
    });
    particle_material.depthTest = false;
    particle_material.vertexColor = true;
    particle_material.transparent = true;
    particle_material.blending = THREE.AdditiveBlending;

    var particle_system = new THREE.PointCloud(particles, particle_material);
    particle_system.frustumCulled = true;
    particle_system.sortParticles = false;
    spaceviz.getScene().add(particle_system);
  }
}
