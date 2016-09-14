(function() {
  var spaceviz = new GenericSpaceViz('container');
  var universe = new Universe(spaceviz, window.DATA);

  spaceviz.init();
  universe.init();

  spaceviz.start();
})();
