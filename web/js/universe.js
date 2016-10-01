'use strict';

var SPREAD_FACTOR = 50;

function Universe(spaceviz, data) {

  var attributes, uniforms;

  this.init = function() {
    // Load dependencies. Right now only texture.
    new THREE.TextureLoader().load('web/images/cloud4.png', function(texture) {
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
      //var name = datum[0];
      //var pos = datum.slice(1, 4);
      var pos = datum.slice(0, 3);
      var count = datum[3];

      var x = pos[0] * SPREAD_FACTOR;
      var y = pos[1] * SPREAD_FACTOR;
      var z = pos[2] * SPREAD_FACTOR;
      positions[i3 + 0] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;

      var color = getColor();
      colors[i3 + 0] = color.r / 255;
      colors[i3 + 1] = color.g / 255;
      colors[i3 + 2] = color.b / 255;

      sizes[i] = Math.max(0.5, Math.min(50, count * 0.1));
    }

    geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.addAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.addAttribute('size', new THREE.BufferAttribute(sizes, 1));

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

function getColor() {
    var rgb;
    var lumpct = Math.random();
    if (lumpct > .8) {
      // bluish
      //rgb = hexToRgb(getColorFromPercent(lumpct, 0xADADFF, 0xffcccc));
      rgb = hexToRgb(0xADADFF);
    } else if (lumpct > .2) {
      // yellowish
      // TODO get rid of green
      // rgb = hexToRgb(getColorFromPercent(lumpct, 0xFFFF75, 0xE6E65C));
      rgb = hexToRgb(0xFFFF75, 0xE6E65C);
    } else {
      // reddish
      rgb = hexToRgb(getColorFromPercent(lumpct, 0xFFD1B2, 0xFFA366));
    }
    return rgb;
}

function getColorFromPercent(value, highColor, lowColor) {
  var r = highColor >> 16;
  var g = highColor >> 8 & 0xFF;
  var b = highColor & 0xFF;

  r += ((lowColor >> 16) - r) * value;
  g += ((lowColor >> 8 & 0xFF) - g) * value;
  b += ((lowColor & 0xFF) - b) * value;

  return (r << 16 | g << 8 | b);
}

function hexToRgb(hex) {
  var bigint = parseInt(hex, 16);
  var r = (bigint >> 16) & 255;
  var g = (bigint >> 8) & 255;
  var b = bigint & 255;
  return {
    'r': r,
    'g': g,
    'b': b
  };
}
