// The svgPanZoom object instance.
var svgpz;
var currentView = 0;

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
  var previousView = currentView;

  if (keyName === '.') {
    console.log(getZoomAndPan().join(', '));
  } else if (keyNameNum >= 0 && keyNameNum <= 9 && views[keyNameNum]) {
    currentView = keyNameNum;
  } else if (keyName === 'ArrowRight' && currentView < views.length - 1) {
    currentView += 1;
  } else if (keyName === 'ArrowLeft' && currentView > 0) {
    currentView -= 1;
  } else {
    var index = getViewIndexByKeyName(keyName, views);
    if (index !== -1) {
      currentView = index;
    }
  }

  if (currentView !== previousView) {
    if (currentView === 0) {
      svgpz.reset();
    } else {
      zoomAndPan(views[currentView]);
    }
  }
}

document.addEventListener('keydown', keyListener, false);
