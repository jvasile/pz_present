// The svgPanZoom object instance.
var svgpz;

window.addEventListener(
  'load',
  function() {
    svgpz = svgPanZoom('#mindmap', {
      zoomEnabled: true,
      controlIconsEnabled: false,
    });
  },
  false
);

function getZoomAndPan() {
  // The raw zoom and pan values are absolute, so we make them
  // relative to the width and height of the SVG.  That way they
  // still work when the window/screen is a different size.
  var zoom = svgpz.getZoom();
  var pan = svgpz.getPan();
  var { width, height } = svgpz.getSizes();
  var relPanX = pan.x / width;
  var relPanY = pan.y / height;
  return [zoom, relPanX, relPanY];
}

function zoomAndPan([zoomValue, panX, panY]) {
  // The 2nd argument to zoom controls whether the zoom value
  // is absolute (true) or relative (false, default).
  svgpz.zoom(zoomValue, true);

  var { width, height } = svgpz.getSizes();
  svgpz.pan({
    x: panX * width,
    y: panY * height,
  });
}

function getViewIndexByKeyName(keyName, views) {
  return views.findIndex(function(view) {
    return view[3] === keyName;
  });
}

function keyListener(event) {
  var keyName = event.key;
  var keyNameNum = Number(keyName);

  if (keyNameNum === 0) {
    svgpz.reset();
  } else if (keyNameNum >= 1 && keyNameNum <= 9 && views[keyNameNum]) {
    zoomAndPan(views[keyNameNum]);
  } else if (keyName === '.') {
    console.log(getZoomAndPan().join(', '));
  } else {
    var index = getViewIndexByKeyName(keyName, views);
    if (index !== -1) {
      zoomAndPan(views[index]);
    }
  }
}

document.addEventListener('keydown', keyListener, false);
